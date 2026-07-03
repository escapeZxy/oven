import { BadRequestException, Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ExerciseTrendSummary, WorkoutLog, WorkoutVolumeSummary } from '@oven/core';
import { AuthenticatedUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { GetExerciseTrendsDto } from './dto/get-exercise-trends.dto';
import { GetWorkoutLogsDto } from './dto/get-workout-logs.dto';
import { GetWorkoutVolumeDto } from './dto/get-workout-volume.dto';
import { WorkoutLogsService } from './workout-logs.service';

/**
 * 暴露训练日志首批查询与写入接口。
 *
 * @example
 * ```http
 * GET /workout-logs/last?exerciseId=squat
 * ```
 */
@Controller('workout-logs')
@UseGuards(JwtAuthGuard)
export class WorkoutLogsController {
  constructor(private readonly workoutLogsService: WorkoutLogsService) {}

  @Get('volume')
  public async getVolume(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: GetWorkoutVolumeDto,
  ): Promise<WorkoutVolumeSummary> {
    return this.workoutLogsService.getVolumeSummary(user.id, query);
  }

  @Get('exercise-trends')
  public async getExerciseTrends(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: GetExerciseTrendsDto,
  ): Promise<ExerciseTrendSummary> {
    return this.workoutLogsService.getExerciseTrendSummary(user.id, query);
  }

  @Get('last')
  public async getLastLogByExercise(
    @CurrentUser() user: AuthenticatedUser,
    @Query('exerciseId') exerciseId?: string,
  ): Promise<WorkoutLog | null> {
    if (!exerciseId) {
      throw new BadRequestException('Query param "exerciseId" is required.');
    }

    return this.workoutLogsService.getLastLogByExercise(user.id, exerciseId);
  }

  @Get()
  public async getByUserId(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: GetWorkoutLogsDto,
  ): Promise<WorkoutLog[]> {
    return this.workoutLogsService.getByUserId(user.id, query);
  }

  @Get(':id')
  public async getById(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<WorkoutLog> {
    return this.workoutLogsService.getById(id, user.id);
  }

  @Post()
  public async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateWorkoutLogDto,
  ): Promise<WorkoutLog> {
    return this.workoutLogsService.create(user.id, dto);
  }
}
