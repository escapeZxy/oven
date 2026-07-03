import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse, AuthenticatedUser, AuthSessionResponse } from './auth.types';
type AuthenticatedRequest = Request & {
    accessToken?: string;
};
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<AuthResponse>;
    login(dto: LoginDto): Promise<AuthResponse>;
    getSession(request: AuthenticatedRequest): Promise<AuthSessionResponse>;
    logout(request: AuthenticatedRequest): Promise<{
        success: true;
    }>;
    getMe(user: AuthenticatedUser): Promise<AuthResponse['user']>;
    private requireAccessToken;
}
export {};
