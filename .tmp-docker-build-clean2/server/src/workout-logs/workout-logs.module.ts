import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkoutLogsController } from './workout-logs.controller';
import { WorkoutLogsService } from './workout-logs.service';

/**
 * 训练日志模块。
 *
 * @example
 * ```ts
 * imports: [WorkoutLogsModule];
 * ```
 */
@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [WorkoutLogsController],
  providers: [WorkoutLogsService],
})
export class WorkoutLogsModule {}
