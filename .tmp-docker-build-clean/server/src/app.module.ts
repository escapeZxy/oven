import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserPlansModule } from './user-plans/user-plans.module';
import { WorkoutLogsModule } from './workout-logs/workout-logs.module';
import { WorkoutPlansModule } from './workout-plans/workout-plans.module';

@Module({
  imports: [PrismaModule, AuthModule, UserPlansModule, WorkoutLogsModule, WorkoutPlansModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
