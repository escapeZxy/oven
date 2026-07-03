import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'node:crypto';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AUTH_ACCESS_TOKEN_TTL_DAYS } from './auth.constants';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PasswordHasherService } from './password-hasher.service';
import { AuthResponse, AuthSessionResponse } from './auth.types';

const userProfileSelect = {
  id: true,
  username: true,
  email: true,
  displayName: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

type UserProfileRecord = Prisma.UserGetPayload<{
  select: typeof userProfileSelect;
}>;

/**
 * 负责用户注册、登录和令牌签发。
 *
 * @example
 * ```ts
 * const session = await authService.login({
 *   identifier: 'john-doe',
 *   password: 'strong-password',
 * });
 * ```
 */
@Injectable()
export class AuthService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly passwordHasher: PasswordHasherService,
  ) {}

  public async register(dto: RegisterDto): Promise<AuthResponse> {
    const username = this.normalizeUsername(dto.username);
    const email = this.normalizeEmail(dto.email);
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
      select: {
        id: true,
      },
    });

    if (existing) {
      throw new ConflictException('Username or email already exists.');
    }

    const created = await this.prisma.user.create({
      data: {
        username,
        email,
        passwordHash: await this.passwordHasher.hash(dto.password),
        displayName: this.normalizeDisplayName(dto.displayName, username),
      },
      select: userProfileSelect,
    });

    return this.buildAuthResponse(created);
  }

  public async login(dto: LoginDto): Promise<AuthResponse> {
    const identifier = dto.identifier.trim().toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isValid = await this.passwordHasher.verify(dto.password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
      },
    });

    return this.buildAuthResponse(user);
  }

  public async getProfile(userId: string): Promise<AuthResponse['user']> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userProfileSelect,
    });

    if (!user) {
      throw new UnauthorizedException('Authenticated user no longer exists.');
    }

    return this.mapUserProfile(user);
  }

  public async restoreSession(accessToken: string): Promise<AuthSessionResponse> {
    const session = await this.getSessionRecord(accessToken);

    return {
      expiresAt: session.expiresAt.toISOString(),
      user: this.mapUserProfile(session.user),
    };
  }

  public async logout(accessToken: string): Promise<void> {
    const tokenHash = this.hashAccessToken(accessToken);
    await this.prisma.authSession.deleteMany({
      where: { tokenHash },
    });
  }

  public async validateAccessToken(accessToken: string): Promise<{
    id: string;
    email: string;
  }> {
    const payload = await this.jwtService.verifyAsync<{
      sub: string;
      email: string;
    }>(accessToken);

    const session = await this.getSessionRecord(accessToken);

    if (session.user.id !== payload.sub || session.user.email !== payload.email) {
      throw new UnauthorizedException('Authenticated session does not match token payload.');
    }

    await this.prisma.authSession.update({
      where: { id: session.id },
      data: { lastSeenAt: new Date() },
    });

    return {
      id: session.user.id,
      email: session.user.email,
    };
  }

  private async buildAuthResponse(user: UserProfileRecord): Promise<AuthResponse> {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });
    const expiresAt = this.buildAccessTokenExpiryDate();

    await this.prisma.authSession.create({
      data: {
        userId: user.id,
        tokenHash: this.hashAccessToken(accessToken),
        expiresAt,
      },
    });

    return {
      accessToken,
      expiresAt: expiresAt.toISOString(),
      user: this.mapUserProfile(user),
    };
  }

  private mapUserProfile(user: UserProfileRecord): AuthResponse['user'] {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt.toISOString(),
    };
  }

  private normalizeUsername(value: string): string {
    return value.trim().toLowerCase();
  }

  private normalizeEmail(value: string): string {
    return value.trim().toLowerCase();
  }

  private normalizeDisplayName(displayName: string | undefined, username: string): string {
    const normalized = displayName?.trim();
    if (normalized) {
      return normalized;
    }

    return username.trim();
  }

  private buildAccessTokenExpiryDate(): Date {
    return new Date(Date.now() + AUTH_ACCESS_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
  }

  private hashAccessToken(accessToken: string): string {
    return createHash('sha256').update(accessToken).digest('hex');
  }

  private async getSessionRecord(accessToken: string): Promise<Prisma.AuthSessionGetPayload<{
    include: {
      user: {
        select: typeof userProfileSelect;
      };
    };
  }>> {
    const tokenHash = this.hashAccessToken(accessToken);
    const session = await this.prisma.authSession.findUnique({
      where: { tokenHash },
      include: {
        user: {
          select: userProfileSelect,
        },
      },
    });

    if (!session) {
      throw new UnauthorizedException('Authenticated session not found.');
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      await this.prisma.authSession.delete({
        where: { id: session.id },
      });
      throw new UnauthorizedException('Authenticated session has expired.');
    }

    return session;
  }
}
