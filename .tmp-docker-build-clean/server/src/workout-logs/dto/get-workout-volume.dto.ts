import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { WorkoutVolumeBucket } from '@oven/core';

export class GetWorkoutVolumeDto {
  @IsOptional()
  @IsIn(['week', 'month'])
  public bucket?: WorkoutVolumeBucket;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(24)
  public limit?: number;
}
