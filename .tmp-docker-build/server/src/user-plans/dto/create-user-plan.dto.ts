import { IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { UserWorkoutPlanStatus } from '../../generated/prisma/client';

/**
 * 创建用户训练计划的请求体。
 *
 * @example
 * ```ts
 * const body: CreateUserPlanDto = {
 *   workoutPlanId: 'plan-1',
 *   startDate: '2026-06-11T00:00:00.000Z',
 * };
 * ```
 */
export class CreateUserPlanDto {
  @IsString()
  public workoutPlanId!: string;

  @IsOptional()
  @IsDateString()
  public startDate?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  public currentDayIndex?: number;

  @IsOptional()
  @IsEnum(UserWorkoutPlanStatus)
  public status?: UserWorkoutPlanStatus;

  @IsOptional()
  @IsBoolean()
  public isArchived?: boolean;

  @IsOptional()
  @IsBoolean()
  public isActive?: boolean;
}
