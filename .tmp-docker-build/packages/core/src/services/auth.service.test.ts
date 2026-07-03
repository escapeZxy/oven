import { AuthService } from './auth.service';
import { UserRepository } from '../repositories/user.repository';
import { UserCredentials } from '../models';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  const testCredentials: UserCredentials = {
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(() => {
    userRepository = new UserRepository();
    authService = new AuthService(userRepository);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const { user, token } = await authService.register(
        testCredentials,
        'testuser',
        'Test User'
      );

      expect(user).toHaveProperty('id');
      expect(user.email).toBe(testCredentials.email);
      expect(user.username).toBe('testuser');
      expect(user.displayName).toBe('Test User');
      expect(token).toHaveProperty('accessToken');
      expect(token).toHaveProperty('refreshToken');
      expect(token).toHaveProperty('expiresAt');
    });

    it('should throw an error if email already exists', async () => {
      // First registration
      await authService.register(
        testCredentials,
        'testuser',
        'Test User'
      );

      // Second registration with same email should fail
      await expect(authService.register(
        testCredentials,
        'testuser2',
        'Test User 2'
      )).rejects.toThrow('Email already registered');
    });

    it('should throw an error if username already exists', async () => {
      // First registration
      await authService.register(
        { email: 'test1@example.com', password: 'password123' },
        'testuser',
        'Test User'
      );

      // Second registration with same username should fail
      await expect(authService.register(
        { email: 'test2@example.com', password: 'password123' },
        'testuser',
        'Test User 2'
      )).rejects.toThrow('Username already taken');
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      // First register the user
      await authService.register(
        testCredentials,
        'testuser',
        'Test User'
      );

      // Then login
      const { user, token } = await authService.login(testCredentials);

      expect(user.email).toBe(testCredentials.email);
      expect(token).toHaveProperty('accessToken');
      expect(token).toHaveProperty('refreshToken');
      expect(token).toHaveProperty('expiresAt');
      expect(user.lastLoginAt).toBeDefined();
    });

    it('should throw an error with invalid credentials', async () => {
      await expect(authService.login({
        email: 'non-existent@example.com',
        password: 'wrongpassword',
      })).rejects.toThrow('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      // Register and login to get a user
      const { user } = await authService.register(
        testCredentials,
        'testuser',
        'Test User'
      );

      // Logout should not throw an error
      await expect(authService.logout(user.id)).resolves.not.toThrow();
    });
  });

  describe('refreshToken', () => {
    it('should generate a new auth token', () => {
      const token = authService.refreshToken('some-refresh-token');
      expect(token).toHaveProperty('accessToken');
      expect(token).toHaveProperty('refreshToken');
      expect(token).toHaveProperty('expiresAt');
    });
  });
});
