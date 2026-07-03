import { IsString, MaxLength, MinLength } from 'class-validator';

/**
 * 登录请求体，支持用用户 ID 或邮箱登录。
 *
 * @example
 * ```ts
 * const body: LoginDto = {
 *   identifier: 'user-1',
 *   password: 'strong-password',
 * };
 * ```
 */
export class LoginDto {
  @IsString()
  @MinLength(3)
  @MaxLength(320)
  public identifier!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  public password!: string;
}
