import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import * as path from 'node:path';
import { createClient } from '@libsql/client';

const MIGRATIONS_TABLE = '_oven_migrations';

type MigrationFile = {
  id: string;
  checksum: string;
  sql: string;
};

async function tableExists(
  client: ReturnType<typeof createClient>,
  tableName: string,
): Promise<boolean> {
  const result = await client.execute({
    sql: "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ? LIMIT 1",
    args: [tableName],
  });

  return result.rows.length > 0;
}

async function bootstrapFromPrismaMigrations(
  client: ReturnType<typeof createClient>,
  migrations: MigrationFile[],
): Promise<void> {
  const hasPrismaMigrationsTable = await tableExists(client, '_prisma_migrations');
  if (!hasPrismaMigrationsTable) {
    return;
  }

  const prismaMigrationsResult = await client.execute(`
    SELECT migration_name
    FROM _prisma_migrations
    WHERE finished_at IS NOT NULL
      AND rolled_back_at IS NULL
  `);
  const prismaAppliedNames = new Set(
    prismaMigrationsResult.rows.map((row) => String(row['migration_name'])),
  );
  const bootstrappedMigrations = migrations.filter((migration) => prismaAppliedNames.has(migration.id));

  for (const migration of bootstrappedMigrations) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO ${MIGRATIONS_TABLE} (id, checksum) VALUES (?, ?)`,
      args: [migration.id, migration.checksum],
    });
  }

  if (bootstrappedMigrations.length > 0) {
    console.log(
      `Bootstrapped libsql migrations from Prisma history: ${bootstrappedMigrations
        .map((migration) => migration.id)
        .join(', ')}`,
    );
  }
}

function resolveDatabaseConfig(): { url: string; authToken?: string } {
  const url = process.env['DATABASE_URL'];
  const authToken = process.env['TURSO_AUTH_TOKEN']?.trim() || undefined;

  if (!url) {
    throw new Error('DATABASE_URL is not configured.');
  }

  return { url, authToken };
}

async function readMigrationFiles(): Promise<MigrationFile[]> {
  const migrationsDir = path.resolve(process.cwd(), 'prisma', 'migrations');
  const entries = await readdir(migrationsDir, { withFileTypes: true });
  const directories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));

  const migrations: MigrationFile[] = [];

  for (const directory of directories) {
    const migrationPath = path.join(migrationsDir, directory, 'migration.sql');
    const sql = await readFile(migrationPath, 'utf8');

    migrations.push({
      id: directory,
      checksum: createHash('sha256').update(sql).digest('hex'),
      sql,
    });
  }

  return migrations;
}

export async function runLibsqlMigrations(): Promise<void> {
  const client = createClient(resolveDatabaseConfig());

  try {
    const migrations = await readMigrationFiles();

    await client.executeMultiple(`
      CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
        id TEXT NOT NULL PRIMARY KEY,
        checksum TEXT NOT NULL,
        applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    let appliedResult = await client.execute(`SELECT id, checksum FROM ${MIGRATIONS_TABLE}`);
    if (appliedResult.rows.length === 0) {
      await bootstrapFromPrismaMigrations(client, migrations);
      appliedResult = await client.execute(`SELECT id, checksum FROM ${MIGRATIONS_TABLE}`);
    }
    const appliedMigrations = new Map(
      appliedResult.rows.map((row) => [String(row['id']), String(row['checksum'])]),
    );

    for (const migration of migrations) {
      const appliedChecksum = appliedMigrations.get(migration.id);

      if (appliedChecksum === migration.checksum) {
        continue;
      }

      if (appliedChecksum) {
        throw new Error(`Migration ${migration.id} has already been applied with a different checksum.`);
      }

      console.log(`Applying libsql migration: ${migration.id}`);
      await client.executeMultiple(migration.sql);
      await client.execute({
        sql: `INSERT INTO ${MIGRATIONS_TABLE} (id, checksum) VALUES (?, ?)`,
        args: [migration.id, migration.checksum],
      });
    }
  } finally {
    client.close();
  }
}
