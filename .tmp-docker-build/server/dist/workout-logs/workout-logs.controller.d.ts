import { ExerciseTrendSummary, WorkoutLog, WorkoutVolumeSummary } from '@oven/core';
import { AuthenticatedUser } from '../auth/auth.types';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { GetExerciseTrendsDto } from './dto/get-exercise-trends.dto';
import { GetWorkoutLogsDto } from './dto/get-workout-logs.dto';
import { GetWorkoutVolumeDto } from './dto/get-workout-volume.dto';
import { WorkoutLogsService } from './workout-logs.service';
export declare class WorkoutLogsController {
    private readonly workoutLogsService;
    constructor(workoutLogsService: WorkoutLogsService);
    getVolume(user: AuthenticatedUser, query: GetWorkoutVolumeDto): Promise<WorkoutVolumeSummary>;
    getExerciseTrends(user: AuthenticatedUser, query: GetExerciseTrendsDto): Promise<ExerciseTrendSummary>;
    getLastLogByExercise(user: AuthenticatedUser, exerciseId?: string): Promise<WorkoutLog | null>;
    getByUserId(user: AuthenticatedUser, query: GetWorkoutLogsDto): Promise<WorkoutLog[]>;
    getById(id: string, user: AuthenticatedUser): Promise<WorkoutLog>;
    create(user: AuthenticatedUser, dto: CreateWorkoutLogDto): Promise<WorkoutLog>;
}
