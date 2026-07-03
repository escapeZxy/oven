import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkoutPlansController } from './workout-plans.controller';
import { WorkoutPlansService } from './workout-plans.service';

/**
 * 训练计划 definition 模块。
 *
 * @example
 * ```ts
 * imports: [WorkoutPlansModule];
 * ```
 */
@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [WorkoutPlansController],
  providers: [WorkoutPlansService],
  exports: [WorkoutPlansService],
})
export class WorkoutPlansModule {}
