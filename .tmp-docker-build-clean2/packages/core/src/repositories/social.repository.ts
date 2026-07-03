import { v4 as uuidv4 } from 'uuid';
import { Follow, Post, Comment, Like, Notification } from '../models';

export class SocialRepository {
  private follows: Follow[] = [];
  private posts: Post[] = [];
  private comments: Comment[] = [];
  private likes: Like[] = [];
  private notifications: Notification[] = [];

  // Follow CRUD
  public async createFollow(followData: Omit<Follow, 'id' | 'createdAt'>): Promise<Follow> {
    const newFollow: Follow = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...followData,
    };
    this.follows.push(newFollow);
    return newFollow;
  }

  public async findFollowById(id: string): Promise<Follow | null> {
    return this.follows.find(follow => follow.id === id) || null;
  }

  public async findFollowByFollowerAndFollowing(followerId: string, followingId: string): Promise<Follow | null> {
    return this.follows.find(follow =>
      follow.followerId === followerId && follow.followingId === followingId
    ) || null;
  }

  public async findFollowersByUserId(userId: string): Promise<Follow[]> {
    return this.follows
      .filter(follow => follow.followingId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async findFollowingByUserId(userId: string): Promise<Follow[]> {
    return this.follows
      .filter(follow => follow.followerId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async deleteFollow(id: string): Promise<boolean> {
    const initialLength = this.follows.length;
    this.follows = this.follows.filter(follow => follow.id !== id);
    return this.follows.length < initialLength;
  }

  public async deleteFollowByFollowerAndFollowing(followerId: string, followingId: string): Promise<boolean> {
    const initialLength = this.follows.length;
    this.follows = this.follows.filter(follow =>
      !(follow.followerId === followerId && follow.followingId === followingId)
    );
    return this.follows.length < initialLength;
  }

  // Post CRUD
  public async createPost(postData: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    const newPost: Post = {
      id: uuidv4(),
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...postData,
    };
    this.posts.push(newPost);
    return newPost;
  }

  public async findPostById(id: string): Promise<Post | null> {
    return this.posts.find(post => post.id === id) || null;
  }

  public async findPostsByUserId(userId: string): Promise<Post[]> {
    return this.posts
      .filter(post => post.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async findPostsByFollowing(userId: string): Promise<Post[]> {
    const following = await this.findFollowingByUserId(userId);
    const followingIds = following.map(f => f.followingId);

    return this.posts
      .filter(post => followingIds.includes(post.userId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async updatePost(post: Post): Promise<Post | null> {
    const existingIndex = this.posts.findIndex(p => p.id === post.id);
    if (existingIndex === -1) {
      return null;
    }

    const updatedPost = {
      ...post,
      updatedAt: new Date().toISOString(),
    };

    this.posts = [
      ...this.posts.slice(0, existingIndex),
      updatedPost,
      ...this.posts.slice(existingIndex + 1)
    ];
    return updatedPost;
  }

  public async incrementPostLikes(postId: string): Promise<Post | null> {
    const post = await this.findPostById(postId);
    if (!post) {
      return null;
    }

    return this.updatePost({
      ...post,
      likes: post.likes + 1,
    });
  }

  public async decrementPostLikes(postId: string): Promise<Post | null> {
    const post = await this.findPostById(postId);
    if (!post || post.likes <= 0) {
      return null;
    }

    return this.updatePost({
      ...post,
      likes: post.likes - 1,
    });
  }

  public async incrementPostComments(postId: string): Promise<Post | null> {
    const post = await this.findPostById(postId);
    if (!post) {
      return null;
    }

    return this.updatePost({
      ...post,
      comments: post.comments + 1,
    });
  }

  public async decrementPostComments(postId: string): Promise<Post | null> {
    const post = await this.findPostById(postId);
    if (!post || post.comments <= 0) {
      return null;
    }

    return this.updatePost({
      ...post,
      comments: post.comments - 1,
    });
  }

  public async deletePost(id: string): Promise<boolean> {
    const initialLength = this.posts.length;
    this.posts = this.posts.filter(post => post.id !== id);
    return this.posts.length < initialLength;
  }

  // Comment CRUD
  public async createComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    const newComment: Comment = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...commentData,
    };
    this.comments.push(newComment);
    await this.incrementPostComments(commentData.postId);
    return newComment;
  }

  public async findCommentById(id: string): Promise<Comment | null> {
    return this.comments.find(comment => comment.id === id) || null;
  }

  public async findCommentsByPostId(postId: string): Promise<Comment[]> {
    return this.comments
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async updateComment(comment: Comment): Promise<Comment | null> {
    const existingIndex = this.comments.findIndex(c => c.id === comment.id);
    if (existingIndex === -1) {
      return null;
    }

    const updatedComment = {
      ...comment,
      updatedAt: new Date().toISOString(),
    };

    this.comments = [
      ...this.comments.slice(0, existingIndex),
      updatedComment,
      ...this.comments.slice(existingIndex + 1)
    ];
    return updatedComment;
  }

  public async deleteComment(id: string): Promise<boolean> {
    const comment = await this.findCommentById(id);
    if (!comment) {
      return false;
    }

    const initialLength = this.comments.length;
    this.comments = this.comments.filter(c => c.id !== id);
    await this.decrementPostComments(comment.postId);
    return this.comments.length < initialLength;
  }

  // Like CRUD
  public async createLike(likeData: Omit<Like, 'id' | 'createdAt'>): Promise<Like> {
    const newLike: Like = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      ...likeData,
    };
    this.likes.push(newLike);
    await this.incrementPostLikes(likeData.postId);
    return newLike;
  }

  public async findLikeById(id: string): Promise<Like | null> {
    return this.likes.find(like => like.id === id) || null;
  }

  public async findLikeByPostAndUser(postId: string, userId: string): Promise<Like | null> {
    return this.likes.find(like => like.postId === postId && like.userId === userId) || null;
  }

  public async findLikesByPostId(postId: string): Promise<Like[]> {
    return this.likes.filter(like => like.postId === postId);
  }

  public async findLikesByUserId(userId: string): Promise<Like[]> {
    return this.likes.filter(like => like.userId === userId);
  }

  public async deleteLike(id: string): Promise<boolean> {
    const like = await this.findLikeById(id);
    if (!like) {
      return false;
    }

    const initialLength = this.likes.length;
    this.likes = this.likes.filter(l => l.id !== id);
    await this.decrementPostLikes(like.postId);
    return this.likes.length < initialLength;
  }

  public async deleteLikeByPostAndUser(postId: string, userId: string): Promise<boolean> {
    const like = await this.findLikeByPostAndUser(postId, userId);
    if (!like) {
      return false;
    }

    return this.deleteLike(like.id);
  }

  // Notification CRUD
  public async createNotification(notificationData: Omit<Notification, 'id' | 'isRead' | 'createdAt'>): Promise<Notification> {
    const newNotification: Notification = {
      id: uuidv4(),
      isRead: false,
      createdAt: new Date().toISOString(),
      ...notificationData,
    };
    this.notifications.push(newNotification);
    return newNotification;
  }

  public async findNotificationById(id: string): Promise<Notification | null> {
    return this.notifications.find(notification => notification.id === id) || null;
  }

  public async findNotificationsByUserId(userId: string): Promise<Notification[]> {
    return this.notifications
      .filter(notification => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async findUnreadNotificationsByUserId(userId: string): Promise<Notification[]> {
    const notifications = await this.findNotificationsByUserId(userId);
    return notifications.filter((notification: Notification) => !notification.isRead);
  }

  public async markNotificationAsRead(id: string): Promise<Notification | null> {
    const notification = await this.findNotificationById(id);
    if (!notification) {
      return null;
    }

    if (notification.isRead) {
      return notification;
    }

    const updatedNotification = {
      ...notification,
      isRead: true,
    };

    const existingIndex = this.notifications.findIndex(n => n.id === id);
    this.notifications = [
      ...this.notifications.slice(0, existingIndex),
      updatedNotification,
      ...this.notifications.slice(existingIndex + 1)
    ];
    return updatedNotification;
  }

  public async markAllNotificationsAsRead(userId: string): Promise<void> {
    this.notifications = this.notifications.map(notification =>
      notification.userId === userId ? { ...notification, isRead: true } : notification
    );
  }

  public async deleteNotification(id: string): Promise<boolean> {
    const initialLength = this.notifications.length;
    this.notifications = this.notifications.filter(notification => notification.id !== id);
    return this.notifications.length < initialLength;
  }

  public async deleteAllNotificationsByUserId(userId: string): Promise<void> {
    this.notifications = this.notifications.filter(notification => notification.userId !== userId);
  }
}
