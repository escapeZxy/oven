import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserPlansController } from './user-plans.controller';
import { UserPlansService } from './user-plans.service';

/**
 * 用户训练计划模块。
 *
 * @example
 * ```ts
 * imports: [UserPlansModule];
 * ```
 */
@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserPlansController],
  providers: [UserPlansService],
  exports: [UserPlansService],
})
export class UserPlansModule {}
