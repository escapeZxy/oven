import 'dotenv/config';
import { INestApplication, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../generated/prisma/client';

/**
 * 提供 Prisma Client 单例，并负责 Nest 生命周期中的连接管理。
 *
 * @example
 * ```ts
 * const plans = await prismaService.userWorkoutPlan.findMany();
 * ```
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  public constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN?.trim() || undefined;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not configured.');
    }

    const adapter = new PrismaLibSql({
      url: databaseUrl,
      authToken,
    });

    super({ adapter });
  }

  public async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  /**
   * 在应用关闭时优雅释放 Prisma 连接。
   *
   * @example
   * ```ts
   * prismaService.enableShutdownHooks(app);
   * ```
   */
  public async enableShutdownHooks(app: INestApplication): Promise<void> {
    app.enableShutdownHooks();
  }
}
