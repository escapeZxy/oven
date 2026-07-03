"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialService = void 0;
var SocialService = /** @class */ (function () {
    function SocialService(socialRepository) {
        this.socialRepository = socialRepository;
    }
    // Follow Methods
    SocialService.prototype.followUser = function (followerId, followingId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingFollow, follow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.socialRepository.findFollowByFollowerAndFollowing(followerId, followingId)];
                    case 1:
                        existingFollow = _a.sent();
                        if (existingFollow) {
                            return [2 /*return*/, existingFollow];
                        }
                        return [4 /*yield*/, this.socialRepository.createFollow({
                                followerId: followerId,
                                followingId: followingId
                            })];
                    case 2:
                        follow = _a.sent();
                        // Create notification for the followed user
                        return [4 /*yield*/, this.createNotification({
                                userId: followingId,
                                type: 'follow',
                                relatedUserId: followerId,
                                message: "User ".concat(followerId, " is now following you")
                            })];
                    case 3:
                        // Create notification for the followed user
                        _a.sent();
                        return [2 /*return*/, follow];
                }
            });
        });
    };
    SocialService.prototype.unfollowUser = function (followerId, followingId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.deleteFollowByFollowerAndFollowing(followerId, followingId)];
            });
        });
    };
    SocialService.prototype.isFollowing = function (followerId, followingId) {
        return __awaiter(this, void 0, void 0, function () {
            var follow;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.socialRepository.findFollowByFollowerAndFollowing(followerId, followingId)];
                    case 1:
                        follow = _a.sent();
                        return [2 /*return*/, !!follow];
                }
            });
        });
    };
    SocialService.prototype.getFollowers = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.findFollowersByUserId(userId)];
            });
        });
    };
    SocialService.prototype.getFollowing = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.findFollowingByUserId(userId)];
            });
        });
    };
    // Post Methods
    SocialService.prototype.createPost = function (postData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.createPost(postData)];
            });
        });
    };
    SocialService.prototype.getPost = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.findPostById(id)];
            });
        });
    };
    SocialService.prototype.getPostsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.findPostsByUserId(userId)];
            });
        });
    };
    SocialService.prototype.getFeed = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.findPostsByFollowing(userId)];
            });
        });
    };
    SocialService.prototype.updatePost = function (post) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.updatePost(post)];
            });
        });
    };
    SocialService.prototype.deletePost = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.deletePost(id)];
            });
        });
    };
    // Comment Methods
    SocialService.prototype.addComment = function (commentData) {
        return __awaiter(this, void 0, void 0, function () {
            var comment, post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.socialRepository.createComment(commentData)];
                    case 1:
                        comment = _a.sent();
                        return [4 /*yield*/, this.getPost(commentData.postId)];
                    case 2:
                        post = _a.sent();
                        if (!(post && post.userId !== commentData.userId)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.createNotification({
                                userId: post.userId,
                                type: 'comment',
                                relatedUserId: commentData.userId,
                                relatedPostId: commentData.postId,
                                message: "User ".concat(commentData.userId, " commented on your post")
                            })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/, comment];
                }
            });
        });
    };
    SocialService.prototype.getComment = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.findCommentById(id)];
            });
        });
    };
    SocialService.prototype.getCommentsByPostId = function (postId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.findCommentsByPostId(postId)];
            });
        });
    };
    SocialService.prototype.updateComment = function (comment) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.updateComment(comment)];
            });
        });
    };
    SocialService.prototype.deleteComment = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.deleteComment(id)];
            });
        });
    };
    // Like Methods
    SocialService.prototype.likePost = function (postId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingLike, like, post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.socialRepository.findLikeByPostAndUser(postId, userId)];
                    case 1:
                        existingLike = _a.sent();
                        if (existingLike) {
                            return [2 /*return*/, existingLike];
                        }
                        return [4 /*yield*/, this.socialRepository.createLike({
                                postId: postId,
                                userId: userId
                            })];
                    case 2:
                        like = _a.sent();
                        return [4 /*yield*/, this.getPost(postId)];
                    case 3:
                        post = _a.sent();
                        if (!(post && post.userId !== userId)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.createNotification({
                                userId: post.userId,
                                type: 'like',
                                relatedUserId: userId,
                                relatedPostId: postId,
                                message: "User ".concat(userId, " liked your post")
                            })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, like];
                }
            });
        });
    };
    SocialService.prototype.unlikePost = function (postId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.deleteLikeByPostAndUser(postId, userId)];
            });
        });
    };
    SocialService.prototype.isPostLiked = function (postId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var like;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.socialRepository.findLikeByPostAndUser(postId, userId)];
                    case 1:
                        like = _a.sent();
                        return [2 /*return*/, !!like];
                }
            });
        });
    };
    SocialService.prototype.getLikesByPostId = function (postId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.findLikesByPostId(postId)];
            });
        });
    };
    // Notification Methods
    SocialService.prototype.createNotification = function (notificationData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.createNotification(notificationData)];
            });
        });
    };
    SocialService.prototype.getNotifications = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.findNotificationsByUserId(userId)];
            });
        });
    };
    SocialService.prototype.getUnreadNotifications = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.findUnreadNotificationsByUserId(userId)];
            });
        });
    };
    SocialService.prototype.markNotificationAsRead = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.markNotificationAsRead(id)];
            });
        });
    };
    SocialService.prototype.markAllNotificationsAsRead = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.markAllNotificationsAsRead(userId)];
            });
        });
    };
    SocialService.prototype.deleteNotification = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.deleteNotification(id)];
            });
        });
    };
    SocialService.prototype.clearAllNotifications = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.socialRepository.deleteAllNotificationsByUserId(userId)];
            });
        });
    };
    // Helper Methods
    SocialService.prototype.getUserActivityFeed = function (userId_1) {
        return __awaiter(this, arguments, void 0, function (userId, limit) {
            var feed;
            if (limit === void 0) { limit = 20; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getFeed(userId)];
                    case 1:
                        feed = _a.sent();
                        return [2 /*return*/, feed.slice(0, limit)];
                }
            });
        });
    };
    SocialService.prototype.getPopularPosts = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var posts;
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAllPosts()];
                    case 1:
                        posts = _a.sent();
                        return [2 /*return*/, posts
                                .sort(function (a, b) { return b.likes + b.comments - (a.likes + a.comments); })
                                .slice(0, limit)];
                }
            });
        });
    };
    SocialService.prototype.getAllPosts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var socialRepository;
            return __generator(this, function (_a) {
                socialRepository = this.socialRepository;
                return [2 /*return*/, socialRepository.posts || []];
            });
        });
    };
    return SocialService;
}());
exports.SocialService = SocialService;
