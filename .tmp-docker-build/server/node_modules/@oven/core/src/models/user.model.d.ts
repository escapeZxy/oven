export interface User {
    id: string;
    email: string;
    username: string;
    displayName: string;
    profileImage?: string;
    createdAt: string;
    lastLoginAt?: string;
}
export interface UserCredentials {
    email: string;
    password: string;
}
export interface AuthToken {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
}
export interface UserSettings {
    userId: string;
    unitSystem: 'metric' | 'imperial';
    weeklyGoalDays: number;
    notificationsEnabled: boolean;
    privacySettings: {
        showWorkouts: boolean;
        showBodyStats: boolean;
        showDiet: boolean;
    };
}
