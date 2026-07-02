/**
 * JWT 负载中承载的最小身份信息。
 */
export interface AuthTokenPayload {
  sub: string;
  email: string;
}

/**
 * 控制器中可用的认证用户上下文。
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
}

/**
 * 登录或注册成功后的统一返回结构。
 */
export interface AuthResponse {
  accessToken: string;
  expiresAt: string;
  user: {
    id: string;
    username: string;
    email: string;
    displayName: string | null;
    createdAt: string;
  };
}

/**
 * 基于现有 Bearer Token 恢复的会话信息。
 */
export interface AuthSessionResponse {
  expiresAt: string;
  user: AuthResponse['user'];
}
