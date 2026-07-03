"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialRepository = void 0;
const uuid_1 = require("uuid");
class SocialRepository {
    constructor() {
        this.follows = [];
        this.posts = [];
        this.comments = [];
        this.likes = [];
        this.notifications = [];
    }
    async createFollow(followData) {
        const newFollow = Object.assign({ id: (0, uuid_1.v4)(), createdAt: new Date().toISOString() }, followData);
        this.follows.push(newFollow);
        return newFollow;
    }
    async findFollowById(id) {
        return this.follows.find(follow => follow.id === id) || null;
    }
    async findFollowByFollowerAndFollowing(followerId, followingId) {
        return this.follows.find(follow => follow.followerId === followerId && follow.followingId === followingId) || null;
    }
    async findFollowersByUserId(userId) {
        return this.follows
            .filter(follow => follow.followingId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    async findFollowingByUserId(userId) {
        return this.follows
            .filter(follow => follow.followerId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    async deleteFollow(id) {
        const initialLength = this.follows.length;
        this.follows = this.follows.filter(follow => follow.id !== id);
        return this.follows.length < initialLength;
    }
    async deleteFollowByFollowerAndFollowing(followerId, followingId) {
        const initialLength = this.follows.length;
        this.follows = this.follows.filter(follow => !(follow.followerId === followerId && follow.followingId === followingId));
        return this.follows.length < initialLength;
    }
    async createPost(postData) {
        const newPost = Object.assign({ id: (0, uuid_1.v4)(), likes: 0, comments: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, postData);
        this.posts.push(newPost);
        return newPost;
    }
    async findPostById(id) {
        return this.posts.find(post => post.id === id) || null;
    }
    async findPostsByUserId(userId) {
        return this.posts
            .filter(post => post.userId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    async findPostsByFollowing(userId) {
        const following = await this.findFollowingByUserId(userId);
        const followingIds = following.map(f => f.followingId);
        return this.posts
            .filter(post => followingIds.includes(post.userId))
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    async updatePost(post) {
        const existingIndex = this.posts.findIndex(p => p.id === post.id);
        if (existingIndex === -1) {
            return null;
        }
        const updatedPost = Object.assign(Object.assign({}, post), { updatedAt: new Date().toISOString() });
        this.posts = [
            ...this.posts.slice(0, existingIndex),
            updatedPost,
            ...this.posts.slice(existingIndex + 1)
        ];
        return updatedPost;
    }
    async incrementPostLikes(postId) {
        const post = await this.findPostById(postId);
        if (!post) {
            return null;
        }
        return this.updatePost(Object.assign(Object.assign({}, post), { likes: post.likes + 1 }));
    }
    async decrementPostLikes(postId) {
        const post = await this.findPostById(postId);
        if (!post || post.likes <= 0) {
            return null;
        }
        return this.updatePost(Object.assign(Object.assign({}, post), { likes: post.likes - 1 }));
    }
    async incrementPostComments(postId) {
        const post = await this.findPostById(postId);
        if (!post) {
            return null;
        }
        return this.updatePost(Object.assign(Object.assign({}, post), { comments: post.comments + 1 }));
    }
    async decrementPostComments(postId) {
        const post = await this.findPostById(postId);
        if (!post || post.comments <= 0) {
            return null;
        }
        return this.updatePost(Object.assign(Object.assign({}, post), { comments: post.comments - 1 }));
    }
    async deletePost(id) {
        const initialLength = this.posts.length;
        this.posts = this.posts.filter(post => post.id !== id);
        return this.posts.length < initialLength;
    }
    async createComment(commentData) {
        const newComment = Object.assign({ id: (0, uuid_1.v4)(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, commentData);
        this.comments.push(newComment);
        await this.incrementPostComments(commentData.postId);
        return newComment;
    }
    async findCommentById(id) {
        return this.comments.find(comment => comment.id === id) || null;
    }
    async findCommentsByPostId(postId) {
        return this.comments
            .filter(comment => comment.postId === postId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    async updateComment(comment) {
        const existingIndex = this.comments.findIndex(c => c.id === comment.id);
        if (existingIndex === -1) {
            return null;
        }
        const updatedComment = Object.assign(Object.assign({}, comment), { updatedAt: new Date().toISOString() });
        this.comments = [
            ...this.comments.slice(0, existingIndex),
            updatedComment,
            ...this.comments.slice(existingIndex + 1)
        ];
        return updatedComment;
    }
    async deleteComment(id) {
        const comment = await this.findCommentById(id);
        if (!comment) {
            return false;
        }
        const initialLength = this.comments.length;
        this.comments = this.comments.filter(c => c.id !== id);
        await this.decrementPostComments(comment.postId);
        return this.comments.length < initialLength;
    }
    async createLike(likeData) {
        const newLike = Object.assign({ id: (0, uuid_1.v4)(), createdAt: new Date().toISOString() }, likeData);
        this.likes.push(newLike);
        await this.incrementPostLikes(likeData.postId);
        return newLike;
    }
    async findLikeById(id) {
        return this.likes.find(like => like.id === id) || null;
    }
    async findLikeByPostAndUser(postId, userId) {
        return this.likes.find(like => like.postId === postId && like.userId === userId) || null;
    }
    async findLikesByPostId(postId) {
        return this.likes.filter(like => like.postId === postId);
    }
    async findLikesByUserId(userId) {
        return this.likes.filter(like => like.userId === userId);
    }
    async deleteLike(id) {
        const like = await this.findLikeById(id);
        if (!like) {
            return false;
        }
        const initialLength = this.likes.length;
        this.likes = this.likes.filter(l => l.id !== id);
        await this.decrementPostLikes(like.postId);
        return this.likes.length < initialLength;
    }
    async deleteLikeByPostAndUser(postId, userId) {
        const like = await this.findLikeByPostAndUser(postId, userId);
        if (!like) {
            return false;
        }
        return this.deleteLike(like.id);
    }
    async createNotification(notificationData) {
        const newNotification = Object.assign({ id: (0, uuid_1.v4)(), isRead: false, createdAt: new Date().toISOString() }, notificationData);
        this.notifications.push(newNotification);
        return newNotification;
    }
    async findNotificationById(id) {
        return this.notifications.find(notification => notification.id === id) || null;
    }
    async findNotificationsByUserId(userId) {
        return this.notifications
            .filter(notification => notification.userId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    async findUnreadNotificationsByUserId(userId) {
        const notifications = await this.findNotificationsByUserId(userId);
        return notifications.filter((notification) => !notification.isRead);
    }
    async markNotificationAsRead(id) {
        const notification = await this.findNotificationById(id);
        if (!notification) {
            return null;
        }
        if (notification.isRead) {
            return notification;
        }
        const updatedNotification = Object.assign(Object.assign({}, notification), { isRead: true });
        const existingIndex = this.notifications.findIndex(n => n.id === id);
        this.notifications = [
            ...this.notifications.slice(0, existingIndex),
            updatedNotification,
            ...this.notifications.slice(existingIndex + 1)
        ];
        return updatedNotification;
    }
    async markAllNotificationsAsRead(userId) {
        this.notifications = this.notifications.map(notification => notification.userId === userId ? Object.assign(Object.assign({}, notification), { isRead: true }) : notification);
    }
    async deleteNotification(id) {
        const initialLength = this.notifications.length;
        this.notifications = this.notifications.filter(notification => notification.id !== id);
        return this.notifications.length < initialLength;
    }
    async deleteAllNotificationsByUserId(userId) {
        this.notifications = this.notifications.filter(notification => notification.userId !== userId);
    }
}
exports.SocialRepository = SocialRepository;
//# sourceMappingURL=social.repository.js.map