import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runLibsqlMigrations } from './prisma/libsql-migration';
import { PrismaService } from './prisma/prisma.service';

function resolveCorsOrigin(): string[] | boolean {
  const configuredOrigins = process.env['CORS_ORIGIN']
    ?.split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  return configuredOrigins && configuredOrigins.length > 0 ? configuredOrigins : true;
}

async function bootstrap() {
  await runLibsqlMigrations();
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env['PORT'] ?? 3000);

  app.enableCors({
    origin: resolveCorsOrigin(),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.get(PrismaService).enableShutdownHooks(app);
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
