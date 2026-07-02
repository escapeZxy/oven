import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { PasswordHasherService } from './password-hasher.service';

type PrismaMock = {
  user: {
    findFirst: jest.Mock;
    create: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
  };
  authSession: {
    create: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    deleteMany: jest.Mock;
  };
};

function createService() {
  const prisma: PrismaMock = {
    user: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    authSession: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };
  const jwtService = {
    signAsync: jest.fn().mockResolvedValue('signed-jwt'),
    verifyAsync: jest.fn().mockResolvedValue({
      sub: 'user-1',
      email: 'john.doe@example.com',
    }),
  };
  const passwordHasher = {
    hash: jest.fn().mockResolvedValue('hashed-password'),
    verify: jest.fn(),
  };

  return {
    prisma,
    jwtService,
    passwordHasher,
    service: new AuthService(
      prisma as unknown as PrismaService,
      jwtService as unknown as JwtService,
      passwordHasher as unknown as PasswordHasherService,
    ),
  };
}

describe('AuthService', () => {
  it('registers a user and normalizes username/email before persistence', async () => {
    const { prisma, service } = createService();

    prisma.user.findFirst.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 'user-2',
      username: 'new_user',
      email: 'new@example.com',
      displayName: 'New User',
      createdAt: new Date('2026-06-27T00:00:00.000Z'),
    });

    const result = await service.register({
      email: ' New@Example.com ',
      username: 'NEW_USER',
      displayName: ' New User ',
      password: 'password-123',
    });

    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          email: 'new@example.com',
          username: 'new_user',
          displayName: 'New User',
        }),
      }),
    );
    expect(result.accessToken).toBe('signed-jwt');
    expect(result.expiresAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(result.user.username).toBe('new_user');
    expect(prisma.authSession.create).toHaveBeenCalled();
  });

  it('rejects duplicate email or username during registration', async () => {
    const { prisma, service } = createService();

    prisma.user.findFirst.mockResolvedValue({
      id: 'user-1',
    });

    await expect(
      service.register({
        email: 'john.doe@example.com',
        username: 'john-doe',
        displayName: 'John Doe',
        password: 'password-123',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('logs in by email and rejects invalid passwords', async () => {
    const { passwordHasher, prisma, service } = createService();

    prisma.user.findFirst.mockResolvedValue({
      id: 'user-1',
      username: 'john-doe',
      email: 'john.doe@example.com',
      displayName: 'John Doe',
      passwordHash: 'stored-hash',
      createdAt: new Date('2026-06-27T00:00:00.000Z'),
      lastLoginAt: null,
    });
    passwordHasher.verify.mockResolvedValue(false);

    await expect(
      service.login({
        identifier: 'JOHN.DOE@EXAMPLE.COM',
        password: 'wrong-password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('returns the current profile for an authenticated user id', async () => {
    const { prisma, service } = createService();

    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      username: 'john-doe',
      email: 'john.doe@example.com',
      displayName: 'John Doe',
      createdAt: new Date('2026-06-27T00:00:00.000Z'),
    });

    const profile = await service.getProfile('user-1');

    expect(profile).toEqual({
      id: 'user-1',
      username: 'john-doe',
      email: 'john.doe@example.com',
      displayName: 'John Doe',
      createdAt: '2026-06-27T00:00:00.000Z',
    });
  });

  it('restores a persisted session by access token hash', async () => {
    const { prisma, service } = createService();

    prisma.authSession.findUnique.mockResolvedValue({
      id: 'session-1',
      expiresAt: new Date('2099-01-01T00:00:00.000Z'),
      user: {
        id: 'user-1',
        username: 'john-doe',
        email: 'john.doe@example.com',
        displayName: 'John Doe',
        createdAt: new Date('2026-06-27T00:00:00.000Z'),
      },
    });

    const session = await service.restoreSession('signed-jwt');

    expect(session).toEqual({
      expiresAt: '2099-01-01T00:00:00.000Z',
      user: {
        id: 'user-1',
        username: 'john-doe',
        email: 'john.doe@example.com',
        displayName: 'John Doe',
        createdAt: '2026-06-27T00:00:00.000Z',
      },
    });
  });

  it('validates access token against persisted session and updates last seen time', async () => {
    const { jwtService, prisma, service } = createService();

    prisma.authSession.findUnique.mockResolvedValue({
      id: 'session-1',
      expiresAt: new Date('2099-01-01T00:00:00.000Z'),
      user: {
        id: 'user-1',
        username: 'john-doe',
        email: 'john.doe@example.com',
        displayName: 'John Doe',
        createdAt: new Date('2026-06-27T00:00:00.000Z'),
      },
    });

    const result = await service.validateAccessToken('signed-jwt');

    expect(jwtService.verifyAsync).toHaveBeenCalledWith('signed-jwt');
    expect(prisma.authSession.update).toHaveBeenCalledWith({
      where: { id: 'session-1' },
      data: { lastSeenAt: expect.any(Date) },
    });
    expect(result).toEqual({
      id: 'user-1',
      email: 'john.doe@example.com',
    });
  });

  it('logs out by deleting the persisted access token hash', async () => {
    const { prisma, service } = createService();

    await service.logout('signed-jwt');

    expect(prisma.authSession.deleteMany).toHaveBeenCalledWith({
      where: {
        tokenHash: expect.any(String),
      },
    });
  });
});
