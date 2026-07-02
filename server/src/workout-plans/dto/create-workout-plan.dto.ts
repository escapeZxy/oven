import { WorkoutPlan } from '@oven/core';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * 创建训练计划 definition 的请求体。
 *
 * @example
 * ```ts
 * const dto: CreateWorkoutPlanDto = {
 *   name: '力量提升 5x5',
 *   description: '基础力量训练计划',
 *   schedule: [],
 * };
 * ```
 */
export class CreateWorkoutPlanDto implements Omit<WorkoutPlan, 'id'> {
  @IsString()
  @IsNotEmpty()
  public readonly name!: string;

  @IsString()
  public readonly description!: string;

  @IsOptional()
  @IsArray()
  public readonly schedule?: WorkoutPlan['schedule'];

  @IsOptional()
  @IsArray()
  public readonly trainingDays?: WorkoutPlan['trainingDays'];
}
