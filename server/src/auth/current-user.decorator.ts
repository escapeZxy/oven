import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedUser } from './auth.types';

type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};

/**
 * 从请求上下文读取当前登录用户。
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.user) {
      throw new UnauthorizedException('Missing authenticated user context.');
    }

    return request.user;
  },
);
