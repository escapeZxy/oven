export interface Follow {
    id: string;
    followerId: string;
    followingId: string;
    createdAt: string;
}
export interface Post {
    id: string;
    userId: string;
    content: string;
    imageUrl?: string;
    workoutLogId?: string;
    nutritionLogId?: string;
    likes: number;
    comments: number;
    createdAt: string;
    updatedAt: string;
}
export interface Comment {
    id: string;
    postId: string;
    userId: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}
export interface Like {
    id: string;
    postId: string;
    userId: string;
    createdAt: string;
}
export interface Notification {
    id: string;
    userId: string;
    type: 'follow' | 'like' | 'comment' | 'workout' | 'nutrition';
    relatedUserId?: string;
    relatedPostId?: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}
