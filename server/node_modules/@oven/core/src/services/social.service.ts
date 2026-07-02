import { Follow, Post, Comment, Like, Notification } from '../models';
import { SocialRepository } from '../repositories/social.repository';

export class SocialService {
  constructor(private socialRepository: SocialRepository) {}

  // Follow Methods
  public async followUser(followerId: string, followingId: string): Promise<Follow | null> {
    // Check if already following
    const existingFollow = await this.socialRepository.findFollowByFollowerAndFollowing(followerId, followingId);
    if (existingFollow) {
      return existingFollow;
    }

    // Create follow relationship
    const follow = await this.socialRepository.createFollow({
      followerId,
      followingId
    });

    // Create notification for the followed user
    await this.createNotification({
      userId: followingId,
      type: 'follow',
      relatedUserId: followerId,
      message: `User ${followerId} is now following you`
    });

    return follow;
  }

  public async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    return this.socialRepository.deleteFollowByFollowerAndFollowing(followerId, followingId);
  }

  public async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.socialRepository.findFollowByFollowerAndFollowing(followerId, followingId);
    return !!follow;
  }

  public async getFollowers(userId: string): Promise<Follow[]> {
    return this.socialRepository.findFollowersByUserId(userId);
  }

  public async getFollowing(userId: string): Promise<Follow[]> {
    return this.socialRepository.findFollowingByUserId(userId);
  }

  // Post Methods
  public async createPost(postData: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    return this.socialRepository.createPost(postData);
  }

  public async getPost(id: string): Promise<Post | null> {
    return this.socialRepository.findPostById(id);
  }

  public async getPostsByUserId(userId: string): Promise<Post[]> {
    return this.socialRepository.findPostsByUserId(userId);
  }

  public async getFeed(userId: string): Promise<Post[]> {
    return this.socialRepository.findPostsByFollowing(userId);
  }

  public async updatePost(post: Post): Promise<Post | null> {
    return this.socialRepository.updatePost(post);
  }

  public async deletePost(id: string): Promise<boolean> {
    return this.socialRepository.deletePost(id);
  }

  // Comment Methods
  public async addComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    const comment = await this.socialRepository.createComment(commentData);

    // Create notification for post owner
    const post = await this.getPost(commentData.postId);
    if (post && post.userId !== commentData.userId) {
      await this.createNotification({
        userId: post.userId,
        type: 'comment',
        relatedUserId: commentData.userId,
        relatedPostId: commentData.postId,
        message: `User ${commentData.userId} commented on your post`
      });
    }

    return comment;
  }

  public async getComment(id: string): Promise<Comment | null> {
    return this.socialRepository.findCommentById(id);
  }

  public async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return this.socialRepository.findCommentsByPostId(postId);
  }

  public async updateComment(comment: Comment): Promise<Comment | null> {
    return this.socialRepository.updateComment(comment);
  }

  public async deleteComment(id: string): Promise<boolean> {
    return this.socialRepository.deleteComment(id);
  }

  // Like Methods
  public async likePost(postId: string, userId: string): Promise<Like | null> {
    // Check if already liked
    const existingLike = await this.socialRepository.findLikeByPostAndUser(postId, userId);
    if (existingLike) {
      return existingLike;
    }

    const like = await this.socialRepository.createLike({
      postId,
      userId
    });

    // Create notification for post owner
    const post = await this.getPost(postId);
    if (post && post.userId !== userId) {
      await this.createNotification({
        userId: post.userId,
        type: 'like',
        relatedUserId: userId,
        relatedPostId: postId,
        message: `User ${userId} liked your post`
      });
    }

    return like;
  }

  public async unlikePost(postId: string, userId: string): Promise<boolean> {
    return this.socialRepository.deleteLikeByPostAndUser(postId, userId);
  }

  public async isPostLiked(postId: string, userId: string): Promise<boolean> {
    const like = await this.socialRepository.findLikeByPostAndUser(postId, userId);
    return !!like;
  }

  public async getLikesByPostId(postId: string): Promise<Like[]> {
    return this.socialRepository.findLikesByPostId(postId);
  }

  // Notification Methods
  public async createNotification(notificationData: Omit<Notification, 'id' | 'isRead' | 'createdAt'>): Promise<Notification> {
    return this.socialRepository.createNotification(notificationData);
  }

  public async getNotifications(userId: string): Promise<Notification[]> {
    return this.socialRepository.findNotificationsByUserId(userId);
  }

  public async getUnreadNotifications(userId: string): Promise<Notification[]> {
    return this.socialRepository.findUnreadNotificationsByUserId(userId);
  }

  public async markNotificationAsRead(id: string): Promise<Notification | null> {
    return this.socialRepository.markNotificationAsRead(id);
  }

  public async markAllNotificationsAsRead(userId: string): Promise<void> {
    return this.socialRepository.markAllNotificationsAsRead(userId);
  }

  public async deleteNotification(id: string): Promise<boolean> {
    return this.socialRepository.deleteNotification(id);
  }

  public async clearAllNotifications(userId: string): Promise<void> {
    return this.socialRepository.deleteAllNotificationsByUserId(userId);
  }

  // Helper Methods
  public async getUserActivityFeed(userId: string, limit: number = 20): Promise<Post[]> {
    // Get posts from users the current user is following
    const feed = await this.getFeed(userId);
    return feed.slice(0, limit);
  }

  public async getPopularPosts(limit: number = 10): Promise<Post[]> {
    // This would typically be sorted by likes/comments, but for now return recent posts
    // In a real implementation, this might use a more sophisticated algorithm
    const posts = await this.getAllPosts();
    return posts
      .sort((a, b) => b.likes + b.comments - (a.likes + a.comments))
      .slice(0, limit);
  }

  private async getAllPosts(): Promise<Post[]> {
    // This is a private method since we don't want to expose all posts publicly
    // In a real implementation, this would likely be restricted by pagination
    const socialRepository = this.socialRepository as any;
    return socialRepository.posts || [];
  }
}