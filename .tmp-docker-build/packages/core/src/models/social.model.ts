/**
 * Represents a follow relationship between two users.
 */
export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string; // ISO 8601 format
}

/**
 * Represents a post created by a user.
 */
export interface Post {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  workoutLogId?: string;
  nutritionLogId?: string;
  likes: number;
  comments: number;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

/**
 * Represents a comment on a post.
 */
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
}

/**
 * Represents a like on a post.
 */
export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: string; // ISO 8601 format
}

/**
 * Represents a notification sent to a user.
 */
export interface Notification {
  id: string;
  userId: string;
  type: 'follow' | 'like' | 'comment' | 'workout' | 'nutrition';
  relatedUserId?: string;
  relatedPostId?: string;
  message: string;
  isRead: boolean;
  createdAt: string; // ISO 8601 format
}
