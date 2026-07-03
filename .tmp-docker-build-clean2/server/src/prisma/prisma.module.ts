import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * 向全局模块暴露 PrismaService，避免重复注册数据库客户端。
 *
 * @example
 * ```ts
 * @Module({
 *   imports: [PrismaModule],
 * })
 * export class AppModule {}
 * ```
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
