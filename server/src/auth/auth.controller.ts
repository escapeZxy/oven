import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthResponse, AuthenticatedUser, AuthSessionResponse } from './auth.types';

type AuthenticatedRequest = Request & {
  accessToken?: string;
};

/**
 * 提供注册、登录和当前用户查询接口。
 */
@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(@Body() dto: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(dto);
  }

  @Post('login')
  public async login(@Body() dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('session')
  public async getSession(
    @Req() request: AuthenticatedRequest,
  ): Promise<AuthSessionResponse> {
    return this.authService.restoreSession(this.requireAccessToken(request));
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  public async logout(@Req() request: AuthenticatedRequest): Promise<{ success: true }> {
    await this.authService.logout(this.requireAccessToken(request));
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  public async getMe(@CurrentUser() user: AuthenticatedUser): Promise<AuthResponse['user']> {
    return this.authService.getProfile(user.id);
  }

  private requireAccessToken(request: AuthenticatedRequest): string {
    if (!request.accessToken) {
      throw new UnauthorizedException('Missing access token in authenticated request.');
    }

    return request.accessToken;
  }
}
