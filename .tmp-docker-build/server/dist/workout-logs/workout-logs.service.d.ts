import { ExerciseTrendSummary, WorkoutLog, WorkoutVolumeSummary } from '@oven/core';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { GetExerciseTrendsDto } from './dto/get-exercise-trends.dto';
import { GetWorkoutLogsDto } from './dto/get-workout-logs.dto';
import { GetWorkoutVolumeDto } from './dto/get-workout-volume.dto';
export declare class WorkoutLogsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getVolumeSummary(userId: string, query: GetWorkoutVolumeDto): Promise<WorkoutVolumeSummary>;
    getExerciseTrendSummary(userId: string, query: GetExerciseTrendsDto): Promise<ExerciseTrendSummary>;
    getById(id: string, userId: string): Promise<WorkoutLog>;
    getByUserId(userId: string, query?: GetWorkoutLogsDto): Promise<WorkoutLog[]>;
    getLastLogByExercise(userId: string, exerciseId: string): Promise<WorkoutLog | null>;
    create(_userId: string, dto: CreateWorkoutLogDto): Promise<WorkoutLog>;
    private aggregateVolumePoints;
    private aggregateExerciseTrendItems;
    private createExerciseTrendItem;
    private calculateLogVolume;
    private calculateExerciseVolume;
    private calculateChangeRate;
    private resolveTrendDirection;
    private getBucketStart;
    private shiftBucket;
    private mapWorkoutLog;
    private readCompletedExercises;
}
