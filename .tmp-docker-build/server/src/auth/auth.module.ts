import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AUTH_ACCESS_TOKEN_TTL, resolveJwtSecret } from './auth.constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { PasswordHasherService } from './password-hasher.service';

/**
 * 认证模块，负责注册、登录和 Bearer Token 校验。
 */
@Module({
  imports: [
    JwtModule.register({
      secret: resolveJwtSecret(),
      signOptions: {
        expiresIn: AUTH_ACCESS_TOKEN_TTL,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordHasherService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
