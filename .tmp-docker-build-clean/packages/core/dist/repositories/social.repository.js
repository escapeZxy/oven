"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialRepository = void 0;
var uuid_1 = require("uuid");
var SocialRepository = /** @class */ (function () {
    function SocialRepository() {
        this.follows = [];
        this.posts = [];
        this.comments = [];
        this.likes = [];
        this.notifications = [];
    }
    // Follow CRUD
    SocialRepository.prototype.createFollow = function (followData) {
        return __awaiter(this, void 0, void 0, function () {
            var newFollow;
            return __generator(this, function (_a) {
                newFollow = __assign({ id: (0, uuid_1.v4)(), createdAt: new Date().toISOString() }, followData);
                this.follows.push(newFollow);
                return [2 /*return*/, newFollow];
            });
        });
    };
    SocialRepository.prototype.findFollowById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.follows.find(function (follow) { return follow.id === id; }) || null];
            });
        });
    };
    SocialRepository.prototype.findFollowByFollowerAndFollowing = function (followerId, followingId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.follows.find(function (follow) {
                        return follow.followerId === followerId && follow.followingId === followingId;
                    }) || null];
            });
        });
    };
    SocialRepository.prototype.findFollowersByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.follows
                        .filter(function (follow) { return follow.followingId === userId; })
                        .sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); })];
            });
        });
    };
    SocialRepository.prototype.findFollowingByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.follows
                        .filter(function (follow) { return follow.followerId === userId; })
                        .sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); })];
            });
        });
    };
    SocialRepository.prototype.deleteFollow = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var initialLength;
            return __generator(this, function (_a) {
                initialLength = this.follows.length;
                this.follows = this.follows.filter(function (follow) { return follow.id !== id; });
                return [2 /*return*/, this.follows.length < initialLength];
            });
        });
    };
    SocialRepository.prototype.deleteFollowByFollowerAndFollowing = function (followerId, followingId) {
        return __awaiter(this, void 0, void 0, function () {
            var initialLength;
            return __generator(this, function (_a) {
                initialLength = this.follows.length;
                this.follows = this.follows.filter(function (follow) {
                    return !(follow.followerId === followerId && follow.followingId === followingId);
                });
                return [2 /*return*/, this.follows.length < initialLength];
            });
        });
    };
    // Post CRUD
    SocialRepository.prototype.createPost = function (postData) {
        return __awaiter(this, void 0, void 0, function () {
            var newPost;
            return __generator(this, function (_a) {
                newPost = __assign({ id: (0, uuid_1.v4)(), likes: 0, comments: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, postData);
                this.posts.push(newPost);
                return [2 /*return*/, newPost];
            });
        });
    };
    SocialRepository.prototype.findPostById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.posts.find(function (post) { return post.id === id; }) || null];
            });
        });
    };
    SocialRepository.prototype.findPostsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.posts
                        .filter(function (post) { return post.userId === userId; })
                        .sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); })];
            });
        });
    };
    SocialRepository.prototype.findPostsByFollowing = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var following, followingIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findFollowingByUserId(userId)];
                    case 1:
                        following = _a.sent();
                        followingIds = following.map(function (f) { return f.followingId; });
                        return [2 /*return*/, this.posts
                                .filter(function (post) { return followingIds.includes(post.userId); })
                                .sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); })];
                }
            });
        });
    };
    SocialRepository.prototype.updatePost = function (post) {
        return __awaiter(this, void 0, void 0, function () {
            var existingIndex, updatedPost;
            return __generator(this, function (_a) {
                existingIndex = this.posts.findIndex(function (p) { return p.id === post.id; });
                if (existingIndex === -1) {
                    return [2 /*return*/, null];
                }
                updatedPost = __assign(__assign({}, post), { updatedAt: new Date().toISOString() });
                this.posts = __spreadArray(__spreadArray(__spreadArray([], this.posts.slice(0, existingIndex), true), [
                    updatedPost
                ], false), this.posts.slice(existingIndex + 1), true);
                return [2 /*return*/, updatedPost];
            });
        });
    };
    SocialRepository.prototype.incrementPostLikes = function (postId) {
        return __awaiter(this, void 0, void 0, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findPostById(postId)];
                    case 1:
                        post = _a.sent();
                        if (!post) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, this.updatePost(__assign(__assign({}, post), { likes: post.likes + 1 }))];
                }
            });
        });
    };
    SocialRepository.prototype.decrementPostLikes = function (postId) {
        return __awaiter(this, void 0, void 0, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findPostById(postId)];
                    case 1:
                        post = _a.sent();
                        if (!post || post.likes <= 0) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, this.updatePost(__assign(__assign({}, post), { likes: post.likes - 1 }))];
                }
            });
        });
    };
    SocialRepository.prototype.incrementPostComments = function (postId) {
        return __awaiter(this, void 0, void 0, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findPostById(postId)];
                    case 1:
                        post = _a.sent();
                        if (!post) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, this.updatePost(__assign(__assign({}, post), { comments: post.comments + 1 }))];
                }
            });
        });
    };
    SocialRepository.prototype.decrementPostComments = function (postId) {
        return __awaiter(this, void 0, void 0, function () {
            var post;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findPostById(postId)];
                    case 1:
                        post = _a.sent();
                        if (!post || post.comments <= 0) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, this.updatePost(__assign(__assign({}, post), { comments: post.comments - 1 }))];
                }
            });
        });
    };
    SocialRepository.prototype.deletePost = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var initialLength;
            return __generator(this, function (_a) {
                initialLength = this.posts.length;
                this.posts = this.posts.filter(function (post) { return post.id !== id; });
                return [2 /*return*/, this.posts.length < initialLength];
            });
        });
    };
    // Comment CRUD
    SocialRepository.prototype.createComment = function (commentData) {
        return __awaiter(this, void 0, void 0, function () {
            var newComment;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newComment = __assign({ id: (0, uuid_1.v4)(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, commentData);
                        this.comments.push(newComment);
                        return [4 /*yield*/, this.incrementPostComments(commentData.postId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, newComment];
                }
            });
        });
    };
    SocialRepository.prototype.findCommentById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.comments.find(function (comment) { return comment.id === id; }) || null];
            });
        });
    };
    SocialRepository.prototype.findCommentsByPostId = function (postId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.comments
                        .filter(function (comment) { return comment.postId === postId; })
                        .sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); })];
            });
        });
    };
    SocialRepository.prototype.updateComment = function (comment) {
        return __awaiter(this, void 0, void 0, function () {
            var existingIndex, updatedComment;
            return __generator(this, function (_a) {
                existingIndex = this.comments.findIndex(function (c) { return c.id === comment.id; });
                if (existingIndex === -1) {
                    return [2 /*return*/, null];
                }
                updatedComment = __assign(__assign({}, comment), { updatedAt: new Date().toISOString() });
                this.comments = __spreadArray(__spreadArray(__spreadArray([], this.comments.slice(0, existingIndex), true), [
                    updatedComment
                ], false), this.comments.slice(existingIndex + 1), true);
                return [2 /*return*/, updatedComment];
            });
        });
    };
    SocialRepository.prototype.deleteComment = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var comment, initialLength;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findCommentById(id)];
                    case 1:
                        comment = _a.sent();
                        if (!comment) {
                            return [2 /*return*/, false];
                        }
                        initialLength = this.comments.length;
                        this.comments = this.comments.filter(function (c) { return c.id !== id; });
                        return [4 /*yield*/, this.decrementPostComments(comment.postId)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.comments.length < initialLength];
                }
            });
        });
    };
    // Like CRUD
    SocialRepository.prototype.createLike = function (likeData) {
        return __awaiter(this, void 0, void 0, function () {
            var newLike;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newLike = __assign({ id: (0, uuid_1.v4)(), createdAt: new Date().toISOString() }, likeData);
                        this.likes.push(newLike);
                        return [4 /*yield*/, this.incrementPostLikes(likeData.postId)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, newLike];
                }
            });
        });
    };
    SocialRepository.prototype.findLikeById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.likes.find(function (like) { return like.id === id; }) || null];
            });
        });
    };
    SocialRepository.prototype.findLikeByPostAndUser = function (postId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.likes.find(function (like) { return like.postId === postId && like.userId === userId; }) || null];
            });
        });
    };
    SocialRepository.prototype.findLikesByPostId = function (postId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.likes.filter(function (like) { return like.postId === postId; })];
            });
        });
    };
    SocialRepository.prototype.findLikesByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.likes.filter(function (like) { return like.userId === userId; })];
            });
        });
    };
    SocialRepository.prototype.deleteLike = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var like, initialLength;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findLikeById(id)];
                    case 1:
                        like = _a.sent();
                        if (!like) {
                            return [2 /*return*/, false];
                        }
                        initialLength = this.likes.length;
                        this.likes = this.likes.filter(function (l) { return l.id !== id; });
                        return [4 /*yield*/, this.decrementPostLikes(like.postId)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, this.likes.length < initialLength];
                }
            });
        });
    };
    SocialRepository.prototype.deleteLikeByPostAndUser = function (postId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var like;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findLikeByPostAndUser(postId, userId)];
                    case 1:
                        like = _a.sent();
                        if (!like) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, this.deleteLike(like.id)];
                }
            });
        });
    };
    // Notification CRUD
    SocialRepository.prototype.createNotification = function (notificationData) {
        return __awaiter(this, void 0, void 0, function () {
            var newNotification;
            return __generator(this, function (_a) {
                newNotification = __assign({ id: (0, uuid_1.v4)(), isRead: false, createdAt: new Date().toISOString() }, notificationData);
                this.notifications.push(newNotification);
                return [2 /*return*/, newNotification];
            });
        });
    };
    SocialRepository.prototype.findNotificationById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.notifications.find(function (notification) { return notification.id === id; }) || null];
            });
        });
    };
    SocialRepository.prototype.findNotificationsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.notifications
                        .filter(function (notification) { return notification.userId === userId; })
                        .sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); })];
            });
        });
    };
    SocialRepository.prototype.findUnreadNotificationsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var notifications;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findNotificationsByUserId(userId)];
                    case 1:
                        notifications = _a.sent();
                        return [2 /*return*/, notifications.filter(function (notification) { return !notification.isRead; })];
                }
            });
        });
    };
    SocialRepository.prototype.markNotificationAsRead = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var notification, updatedNotification, existingIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findNotificationById(id)];
                    case 1:
                        notification = _a.sent();
                        if (!notification) {
                            return [2 /*return*/, null];
                        }
                        if (notification.isRead) {
                            return [2 /*return*/, notification];
                        }
                        updatedNotification = __assign(__assign({}, notification), { isRead: true });
                        existingIndex = this.notifications.findIndex(function (n) { return n.id === id; });
                        this.notifications = __spreadArray(__spreadArray(__spreadArray([], this.notifications.slice(0, existingIndex), true), [
                            updatedNotification
                        ], false), this.notifications.slice(existingIndex + 1), true);
                        return [2 /*return*/, updatedNotification];
                }
            });
        });
    };
    SocialRepository.prototype.markAllNotificationsAsRead = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.notifications = this.notifications.map(function (notification) {
                    return notification.userId === userId ? __assign(__assign({}, notification), { isRead: true }) : notification;
                });
                return [2 /*return*/];
            });
        });
    };
    SocialRepository.prototype.deleteNotification = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var initialLength;
            return __generator(this, function (_a) {
                initialLength = this.notifications.length;
                this.notifications = this.notifications.filter(function (notification) { return notification.id !== id; });
                return [2 /*return*/, this.notifications.length < initialLength];
            });
        });
    };
    SocialRepository.prototype.deleteAllNotificationsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.notifications = this.notifications.filter(function (notification) { return notification.userId !== userId; });
                return [2 /*return*/];
            });
        });
    };
    return SocialRepository;
}());
exports.SocialRepository = SocialRepository;
