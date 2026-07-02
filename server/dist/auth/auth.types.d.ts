export interface AuthTokenPayload {
    sub: string;
    email: string;
}
export interface AuthenticatedUser {
    id: string;
    email: string;
}
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
export interface AuthSessionResponse {
    expiresAt: string;
    user: AuthResponse['user'];
}
