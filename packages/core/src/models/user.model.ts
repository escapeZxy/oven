/**
 * Represents a user in the system.
 */
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  profileImage?: string;
  createdAt: string; // ISO 8601 format
  lastLoginAt?: string; // ISO 8601 format
}

/**
 * Represents the user's authentication credentials.
 */
export interface UserCredentials {
  email: string;
  password: string;
}

/**
 * Represents the user's authentication token.
 */
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: string; // ISO 8601 format
}

/**
 * Represents the user's profile settings.
 */
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
