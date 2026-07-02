import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {
  CompletedExerciseLog,
  ExerciseTrendDirection,
  ExerciseTrendItem,
  ExerciseTrendPoint,
  ExerciseTrendSummary,
  WorkoutLog,
  WorkoutVolumeBucket,
  WorkoutVolumePoint,
  WorkoutVolumeSummary,
} from '@oven/core';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, WorkoutLogStatus, type WorkoutLog as PrismaWorkoutLog } from '../generated/prisma/client';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { GetExerciseTrendsDto } from './dto/get-exercise-trends.dto';
import { GetWorkoutLogsDto } from './dto/get-workout-logs.dto';
import { GetWorkoutVolumeDto } from './dto/get-workout-volume.dto';

/**
 * 负责训练日志的持久化、查询与 Prisma 映射。
 *
 * @example
 * ```ts
 * const logs = await workoutLogsService.getByUserId('user-1');
 * ```
 */
@Injectable()
export class WorkoutLogsService {
  public constructor(private readonly prisma: PrismaService) {}

  public async getVolumeSummary(
    userId: string,
    query: GetWorkoutVolumeDto,
  ): Promise<WorkoutVolumeSummary> {
    const bucket = query.bucket ?? 'week';
    const limit = query.limit ?? (bucket === 'week' ? 8 : 6);
    const completedLogs = await this.prisma.workoutLog.findMany({
      where: {
        userId,
        status: WorkoutLogStatus.completed,
      },
      orderBy: { date: 'asc' },
    });

    return {
      bucket,
      points: this.aggregateVolumePoints(completedLogs, bucket, limit),
    };
  }

  public async getExerciseTrendSummary(
    userId: string,
    query: GetExerciseTrendsDto,
  ): Promise<ExerciseTrendSummary> {
    const limit = query.limit ?? 5;
    const completedLogs = await this.prisma.workoutLog.findMany({
      where: {
        userId,
        status: WorkoutLogStatus.completed,
      },
      orderBy: { date: 'desc' },
    });

    return {
      items: this.aggregateExerciseTrendItems(completedLogs, limit),
    };
  }

  public async getById(id: string, userId: string): Promise<WorkoutLog> {
    const log = await this.prisma.workoutLog.findFirst({
      where: { id, userId },
    });

    if (!log) {
      throw new NotFoundException(`Workout log "${id}" not found.`);
    }

    return this.mapWorkoutLog(log);
  }

  public async getByUserId(userId: string, query: GetWorkoutLogsDto = {}): Promise<WorkoutLog[]> {
    const logs = await this.prisma.workoutLog.findMany({
      where: {
        userId,
        ...(query.updatedAfter
          ? {
              updatedAt: {
                gte: new Date(query.updatedAfter),
              },
            }
          : {}),
      },
      orderBy: [{ updatedAt: 'asc' }, { id: 'asc' }],
      take: query.limit,
    });

    return logs.map((log) => this.mapWorkoutLog(log));
  }

  public async getLastLogByExercise(
    userId: string,
    exerciseId: string,
  ): Promise<WorkoutLog | null> {
    const logs = await this.prisma.workoutLog.findMany({
      where: {
        userId,
        status: WorkoutLogStatus.completed,
      },
      orderBy: { date: 'desc' },
    });

    const matched = logs.find((log) =>
      this.readCompletedExercises(log.completedExercises).some(
        (exercise) => exercise.exerciseId === exerciseId,
      ),
    );

    return matched ? this.mapWorkoutLog(matched) : null;
  }

  public async create(_userId: string, dto: CreateWorkoutLogDto): Promise<WorkoutLog> {
    throw new ConflictException(
      `Direct workout log creation is disabled for formal records. Use POST /user-plans/${dto.userPlanId}/logs to create the log and advance the plan atomically.`,
    );
  }

  private aggregateVolumePoints(
    logs: PrismaWorkoutLog[],
    bucket: WorkoutVolumeBucket,
    limit: number,
  ): WorkoutVolumePoint[] {
    const now = new Date();
    const currentBucketStart = this.getBucketStart(now, bucket);
    const bucketStarts = Array.from({ length: limit }, (_, index) =>
      this.shiftBucket(currentBucketStart, bucket, index - limit + 1),
    );
    const points = new Map<string, WorkoutVolumePoint>();

    for (const bucketStart of bucketStarts) {
      const nextBucketStart = this.shiftBucket(bucketStart, bucket, 1);
      points.set(bucketStart.toISOString(), {
        bucketStart: bucketStart.toISOString(),
        bucketEnd: new Date(nextBucketStart.getTime() - 1).toISOString(),
        volume: 0,
        completedLogCount: 0,
      });
    }

    for (const log of logs) {
      const bucketStart = this.getBucketStart(log.date, bucket).toISOString();
      const point = points.get(bucketStart);
      if (!point) {
        continue;
      }

      point.volume += this.calculateLogVolume(this.readCompletedExercises(log.completedExercises));
      point.completedLogCount += 1;
    }

    return bucketStarts
      .map((bucketStart) => points.get(bucketStart.toISOString()))
      .filter((point): point is WorkoutVolumePoint => Boolean(point));
  }

  private aggregateExerciseTrendItems(
    logs: PrismaWorkoutLog[],
    limit: number,
  ): ExerciseTrendItem[] {
    const grouped = new Map<string, ExerciseTrendPoint[]>();

    for (const log of logs) {
      const loggedAt = log.date.toISOString();

      for (const exercise of this.readCompletedExercises(log.completedExercises)) {
        const point: ExerciseTrendPoint = {
          loggedAt,
          volume: this.calculateExerciseVolume(exercise),
        };
        const points = grouped.get(exercise.exerciseId);

        if (points) {
          points.push(point);
          continue;
        }

        grouped.set(exercise.exerciseId, [point]);
      }
    }

    return Array.from(grouped.entries())
      .map(([exerciseId, points]) => this.createExerciseTrendItem(exerciseId, points))
      .sort((left, right) => new Date(right.latestLogAt).getTime() - new Date(left.latestLogAt).getTime())
      .slice(0, limit);
  }

  private createExerciseTrendItem(
    exerciseId: string,
    points: ExerciseTrendPoint[],
  ): ExerciseTrendItem {
    const orderedPoints = [...points].sort(
      (left, right) => new Date(left.loggedAt).getTime() - new Date(right.loggedAt).getTime(),
    );
    const recentPoints = orderedPoints.slice(-4);
    const latestPoint = recentPoints.at(-1);

    if (!latestPoint) {
      throw new Error(`Exercise trend "${exerciseId}" must contain at least one point.`);
    }

    const previousPoint = recentPoints.at(-2) ?? null;
    const latestVolume = latestPoint.volume;
    const previousVolume = previousPoint?.volume ?? null;
    const changeVolume = previousVolume === null ? null : latestVolume - previousVolume;

    return {
      exerciseId,
      latestLogAt: latestPoint.loggedAt,
      latestVolume,
      previousVolume,
      changeVolume,
      changeRate: this.calculateChangeRate(latestVolume, previousVolume),
      direction: this.resolveTrendDirection(latestVolume, previousVolume),
      sessionCount: orderedPoints.length,
      points: recentPoints,
    };
  }

  private calculateLogVolume(exercises: CompletedExerciseLog[]): number {
    return exercises.reduce((total, exercise) => {
      return total + this.calculateExerciseVolume(exercise);
    }, 0);
  }

  private calculateExerciseVolume(exercise: CompletedExerciseLog): number {
    return exercise.weight.reduce(
      (exerciseTotal, weight, index) => exerciseTotal + weight * (exercise.reps[index] ?? 0),
      0,
    );
  }

  private calculateChangeRate(latestVolume: number, previousVolume: number | null): number | null {
    if (previousVolume === null || previousVolume === 0) {
      return null;
    }

    return ((latestVolume - previousVolume) / previousVolume) * 100;
  }

  private resolveTrendDirection(
    latestVolume: number,
    previousVolume: number | null,
  ): ExerciseTrendDirection {
    if (previousVolume === null) {
      return 'new';
    }

    if (latestVolume > previousVolume) {
      return 'up';
    }

    if (latestVolume < previousVolume) {
      return 'down';
    }

    return 'stable';
  }

  private getBucketStart(date: Date, bucket: WorkoutVolumeBucket): Date {
    const normalized = new Date(date);
    normalized.setUTCHours(0, 0, 0, 0);

    if (bucket === 'month') {
      return new Date(Date.UTC(normalized.getUTCFullYear(), normalized.getUTCMonth(), 1));
    }

    const day = normalized.getUTCDay();
    const diff = normalized.getUTCDate() - day + (day === 0 ? -6 : 1);
    return new Date(Date.UTC(normalized.getUTCFullYear(), normalized.getUTCMonth(), diff));
  }

  private shiftBucket(date: Date, bucket: WorkoutVolumeBucket, offset: number): Date {
    if (bucket === 'month') {
      return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1));
    }

    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + offset * 7));
  }

  private mapWorkoutLog(log: PrismaWorkoutLog): WorkoutLog {
    return {
      id: log.id,
      userId: log.userId,
      workoutPlanId: log.workoutPlanId,
      trainingDayId: log.trainingDayId,
      createdAt: (log.createdAt ?? log.date).toISOString(),
      updatedAt: (log.updatedAt ?? log.date).toISOString(),
      date: log.date.toISOString(),
      status: log.status,
      completedExercises: this.readCompletedExercises(log.completedExercises),
    };
  }

  private readCompletedExercises(value: Prisma.JsonValue): CompletedExerciseLog[] {
    if (!Array.isArray(value)) {
      throw new Error('Invalid workout log payload stored in database.');
    }

    return value as unknown as CompletedExerciseLog[];
  }
}
