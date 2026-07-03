import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PasswordHasherService } from './password-hasher.service';
import { AuthResponse, AuthSessionResponse } from './auth.types';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly passwordHasher;
    constructor(prisma: PrismaService, jwtService: JwtService, passwordHasher: PasswordHasherService);
    register(dto: RegisterDto): Promise<AuthResponse>;
    login(dto: LoginDto): Promise<AuthResponse>;
    getProfile(userId: string): Promise<AuthResponse['user']>;
    restoreSession(accessToken: string): Promise<AuthSessionResponse>;
    logout(accessToken: string): Promise<void>;
    validateAccessToken(accessToken: string): Promise<{
        id: string;
        email: string;
    }>;
    private buildAuthResponse;
    private mapUserProfile;
    private normalizeUsername;
    private normalizeEmail;
    private normalizeDisplayName;
    private buildAccessTokenExpiryDate;
    private hashAccessToken;
    private getSessionRecord;
}
