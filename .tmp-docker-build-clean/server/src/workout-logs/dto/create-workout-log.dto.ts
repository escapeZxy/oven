import { IsArray, IsDateString, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WorkoutLogStatus } from '../../generated/prisma/client';
import { CompletedExerciseLogDto } from './completed-exercise-log.dto';

/**
 * 创建训练日志的请求体。
 *
 * @example
 * ```ts
 * const body: CreateWorkoutLogDto = {
 *   userPlanId: 'cup123',
 *   workoutPlanId: 'plan-1',
 *   trainingDayId: 'day-1',
 *   status: WorkoutLogStatus.completed,
 *   completedExercises: [{
 *     exerciseId: 'squat',
 *     sets: 3,
 *     reps: [5, 5, 5],
 *     weight: [100, 100, 100],
 *   }],
 * };
 * ```
 */
export class CreateWorkoutLogDto {
  @IsString()
  public userPlanId!: string;

  @IsString()
  public workoutPlanId!: string;

  @IsString()
  public trainingDayId!: string;

  @IsOptional()
  @IsDateString()
  public date?: string;

  @IsEnum(WorkoutLogStatus)
  public status!: WorkoutLogStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompletedExerciseLogDto)
  public completedExercises!: CompletedExerciseLogDto[];
}
