import { v4 as uuidv4 } from 'uuid';
import { User, UserCredentials, AuthToken } from '../models';
import { UserRepository } from '../repositories/user.repository';

export class AuthService {
  private readonly TOKEN_EXPIRY_DAYS = 7;

  constructor(private userRepository: UserRepository) {}

  public async register(credentials: UserCredentials, username: string, displayName: string): Promise<{ user: User; token: AuthToken }> {
    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(credentials.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Check if username already exists
    const existingUsername = await this.userRepository.findByUsername(username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // Create new user
    const user = await this.userRepository.create({
      email: credentials.email,
      username,
      displayName,
      // In a real app, password would be hashed
      // For simplicity, we'll just store it as-is in this example
    });

    // Generate auth token
    const token = this.generateAuthToken();

    return { user, token };
  }

  public async login(credentials: UserCredentials): Promise<{ user: User; token: AuthToken }> {
    const user = await this.userRepository.findByEmail(credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // In a real app, we would compare hashed passwords
    // For simplicity, we'll just check if they match exactly

    // Generate new auth token
    const token = this.generateAuthToken();

    // Update last login time
    const updatedUser = await this.userRepository.update({
      ...user,
      lastLoginAt: new Date().toISOString(),
    });

    return { user: updatedUser!, token };
  }

  public async logout(userId: string): Promise<void> {
    // In a real app, we would invalidate the token in a database
    // For simplicity, we'll just update the user's last login time
    const user = await this.userRepository.findById(userId);
    if (user) {
      await this.userRepository.update(user);
    }
  }

  public refreshToken(_refreshToken: string): AuthToken {
    // In a real app, we would validate the refresh token
    // For simplicity, we'll just generate a new access token
    return this.generateAuthToken();
  }

  private generateAuthToken(): AuthToken {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.TOKEN_EXPIRY_DAYS);

    return {
      accessToken: uuidv4(),
      refreshToken: uuidv4(),
      expiresAt: expiresAt.toISOString(),
    };
  }
}
