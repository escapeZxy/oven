import { ArrayMinSize, IsArray, IsInt, IsString, Min } from 'class-validator';

/**
 * 单个动作的完成记录。
 *
 * @example
 * ```ts
 * const exercise: CompletedExerciseLogDto = {
 *   exerciseId: 'bench-press',
 *   sets: 3,
 *   reps: [10, 8, 8],
 *   weight: [60, 65, 65],
 * };
 * ```
 */
export class CompletedExerciseLogDto {
  @IsString()
  public exerciseId!: string;

  @IsInt()
  @Min(1)
  public sets!: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(0, { each: true })
  public reps!: number[];

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Min(0, { each: true })
  public weight!: number[];
}
