import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

/**
 * 注册账号的请求体。
 *
 * @example
 * ```ts
 * const body: RegisterDto = {
 *   username: 'john-doe',
 *   email: 'user-1@example.com',
 *   password: 'strong-password',
 *   displayName: 'User One',
 * };
 * ```
 */
export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  @Matches(/^[A-Za-z0-9](?:[A-Za-z0-9_-]{1,62}[A-Za-z0-9])?$/)
  public username!: string;

  @IsEmail()
  @MaxLength(320)
  public email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  public password!: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  @Matches(/^(?!.*[\r\n\t]).+$/u)
  public displayName?: string;
}
