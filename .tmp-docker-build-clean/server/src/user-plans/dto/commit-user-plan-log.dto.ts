import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserWorkoutPlanStatus, WorkoutLogStatus } from '../../generated/prisma/client';
import { CompletedExerciseLogDto } from '../../workout-logs/dto/completed-exercise-log.dto';

/**
 * 在一次请求内提交训练日志并推进用户计划。
 *
 * @example
 * ```ts
 * const body: CommitUserPlanLogDto = {
 *   clientRequestId: 'req-123',
 *   workoutPlanId: 'plan-1',
 *   trainingDayId: 'day-2',
 *   expectedCurrentDayIndex: 1,
 *   nextDayIndex: 2,
 *   userPlanStatus: UserWorkoutPlanStatus.active,
 *   isActive: true,
 *   logStatus: WorkoutLogStatus.completed,
 *   completedExercises: [{
 *     exerciseId: 'squat',
 *     sets: 3,
 *     reps: [5, 5, 5],
 *     weight: [100, 100, 100],
 *   }],
 * };
 *
 * const skippedBody: CommitUserPlanLogDto = {
 *   clientRequestId: 'req-456',
 *   workoutPlanId: 'plan-1',
 *   trainingDayId: 'day-2',
 *   expectedCurrentDayIndex: 1,
 *   nextDayIndex: 2,
 *   userPlanStatus: UserWorkoutPlanStatus.active,
 *   isActive: true,
 *   logStatus: WorkoutLogStatus.skipped,
 *   completedExercises: [],
 * };
 * ```
 */
export class CommitUserPlanLogDto {
  @IsOptional()
  @IsString()
  public clientRequestId?: string;

  @IsString()
  public workoutPlanId!: string;

  @IsString()
  public trainingDayId!: string;

  @IsInt()
  @Min(0)
  public expectedCurrentDayIndex!: number;

  @IsInt()
  @Min(0)
  public nextDayIndex!: number;

  @IsEnum(UserWorkoutPlanStatus)
  public userPlanStatus!: UserWorkoutPlanStatus;

  @IsBoolean()
  public isActive!: boolean;

  @IsEnum(WorkoutLogStatus)
  public logStatus!: WorkoutLogStatus;

  @IsOptional()
  @IsDateString()
  public date?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompletedExerciseLogDto)
  public completedExercises!: CompletedExerciseLogDto[];
}
