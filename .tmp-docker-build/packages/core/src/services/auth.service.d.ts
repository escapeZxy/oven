import { User, UserCredentials, AuthToken } from '../models';
import { UserRepository } from '../repositories/user.repository';
export declare class AuthService {
    private userRepository;
    private readonly TOKEN_EXPIRY_DAYS;
    constructor(userRepository: UserRepository);
    register(credentials: UserCredentials, username: string, displayName: string): Promise<{
        user: User;
        token: AuthToken;
    }>;
    login(credentials: UserCredentials): Promise<{
        user: User;
        token: AuthToken;
    }>;
    logout(userId: string): Promise<void>;
    refreshToken(_refreshToken: string): AuthToken;
    private generateAuthToken;
}
