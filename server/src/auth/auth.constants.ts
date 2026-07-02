import 'dotenv/config';

export const AUTH_ACCESS_TOKEN_TTL = '7d';
export const AUTH_ACCESS_TOKEN_TTL_DAYS = 7;

export function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured.');
  }

  return secret;
}
