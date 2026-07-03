"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialService = void 0;
class SocialService {
    constructor(socialRepository) {
        this.socialRepository = socialRepository;
    }
    async followUser(followerId, followingId) {
        const existingFollow = await this.socialRepository.findFollowByFollowerAndFollowing(followerId, followingId);
        if (existingFollow) {
            return existingFollow;
        }
        const follow = await this.socialRepository.createFollow({
            followerId,
            followingId
        });
        await this.createNotification({
            userId: followingId,
            type: 'follow',
            relatedUserId: followerId,
            message: `User ${followerId} is now following you`
        });
        return follow;
    }
    async unfollowUser(followerId, followingId) {
        return this.socialRepository.deleteFollowByFollowerAndFollowing(followerId, followingId);
    }
    async isFollowing(followerId, followingId) {
        const follow = await this.socialRepository.findFollowByFollowerAndFollowing(followerId, followingId);
        return !!follow;
    }
    async getFollowers(userId) {
        return this.socialRepository.findFollowersByUserId(userId);
    }
    async getFollowing(userId) {
        return this.socialRepository.findFollowingByUserId(userId);
    }
    async createPost(postData) {
        return this.socialRepository.createPost(postData);
    }
    async getPost(id) {
        return this.socialRepository.findPostById(id);
    }
    async getPostsByUserId(userId) {
        return this.socialRepository.findPostsByUserId(userId);
    }
    async getFeed(userId) {
        return this.socialRepository.findPostsByFollowing(userId);
    }
    async updatePost(post) {
        return this.socialRepository.updatePost(post);
    }
    async deletePost(id) {
        return this.socialRepository.deletePost(id);
    }
    async addComment(commentData) {
        const comment = await this.socialRepository.createComment(commentData);
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
    async getComment(id) {
        return this.socialRepository.findCommentById(id);
    }
    async getCommentsByPostId(postId) {
        return this.socialRepository.findCommentsByPostId(postId);
    }
    async updateComment(comment) {
        return this.socialRepository.updateComment(comment);
    }
    async deleteComment(id) {
        return this.socialRepository.deleteComment(id);
    }
    async likePost(postId, userId) {
        const existingLike = await this.socialRepository.findLikeByPostAndUser(postId, userId);
        if (existingLike) {
            return existingLike;
        }
        const like = await this.socialRepository.createLike({
            postId,
            userId
        });
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
    async unlikePost(postId, userId) {
        return this.socialRepository.deleteLikeByPostAndUser(postId, userId);
    }
    async isPostLiked(postId, userId) {
        const like = await this.socialRepository.findLikeByPostAndUser(postId, userId);
        return !!like;
    }
    async getLikesByPostId(postId) {
        return this.socialRepository.findLikesByPostId(postId);
    }
    async createNotification(notificationData) {
        return this.socialRepository.createNotification(notificationData);
    }
    async getNotifications(userId) {
        return this.socialRepository.findNotificationsByUserId(userId);
    }
    async getUnreadNotifications(userId) {
        return this.socialRepository.findUnreadNotificationsByUserId(userId);
    }
    async markNotificationAsRead(id) {
        return this.socialRepository.markNotificationAsRead(id);
    }
    async markAllNotificationsAsRead(userId) {
        return this.socialRepository.markAllNotificationsAsRead(userId);
    }
    async deleteNotification(id) {
        return this.socialRepository.deleteNotification(id);
    }
    async clearAllNotifications(userId) {
        return this.socialRepository.deleteAllNotificationsByUserId(userId);
    }
    async getUserActivityFeed(userId, limit = 20) {
        const feed = await this.getFeed(userId);
        return feed.slice(0, limit);
    }
    async getPopularPosts(limit = 10) {
        const posts = await this.getAllPosts();
        return posts
            .sort((a, b) => b.likes + b.comments - (a.likes + a.comments))
            .slice(0, limit);
    }
    async getAllPosts() {
        const socialRepository = this.socialRepository;
        return socialRepository.posts || [];
    }
}
exports.SocialService = SocialService;
//# sourceMappingURL=social.service.js.map