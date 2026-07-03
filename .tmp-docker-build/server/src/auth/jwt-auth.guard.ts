import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from './auth.types';

type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
  accessToken?: string;
};

/**
 * 解析 Bearer Token，并把身份上下文挂到请求对象上。
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  public constructor(private readonly authService: AuthService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing bearer token.');
    }

    try {
      request.user = await this.authService.validateAccessToken(token);
      request.accessToken = token;
    } catch {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    return true;
  }

  private extractBearerToken(request: Request): string | undefined {
    const authorization = request.headers.authorization;

    if (!authorization) {
      return undefined;
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return undefined;
    }

    return token;
  }
}
