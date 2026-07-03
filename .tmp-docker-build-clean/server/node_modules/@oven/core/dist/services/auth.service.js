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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var uuid_1 = require("uuid");
var AuthService = /** @class */ (function () {
    function AuthService(userRepository) {
        this.userRepository = userRepository;
        this.TOKEN_EXPIRY_DAYS = 7;
    }
    AuthService.prototype.register = function (credentials, username, displayName) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, existingUsername, user, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findByEmail(credentials.email)];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser) {
                            throw new Error('Email already registered');
                        }
                        return [4 /*yield*/, this.userRepository.findByUsername(username)];
                    case 2:
                        existingUsername = _a.sent();
                        if (existingUsername) {
                            throw new Error('Username already taken');
                        }
                        return [4 /*yield*/, this.userRepository.create({
                                email: credentials.email,
                                username: username,
                                displayName: displayName,
                                // In a real app, password would be hashed
                                // For simplicity, we'll just store it as-is in this example
                            })];
                    case 3:
                        user = _a.sent();
                        token = this.generateAuthToken();
                        return [2 /*return*/, { user: user, token: token }];
                }
            });
        });
    };
    AuthService.prototype.login = function (credentials) {
        return __awaiter(this, void 0, void 0, function () {
            var user, token, updatedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findByEmail(credentials.email)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new Error('Invalid credentials');
                        }
                        token = this.generateAuthToken();
                        return [4 /*yield*/, this.userRepository.update(__assign(__assign({}, user), { lastLoginAt: new Date().toISOString() }))];
                    case 2:
                        updatedUser = _a.sent();
                        return [2 /*return*/, { user: updatedUser, token: token }];
                }
            });
        });
    };
    AuthService.prototype.logout = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findById(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.userRepository.update(user)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.refreshToken = function (_refreshToken) {
        // In a real app, we would validate the refresh token
        // For simplicity, we'll just generate a new access token
        return this.generateAuthToken();
    };
    AuthService.prototype.generateAuthToken = function () {
        var expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + this.TOKEN_EXPIRY_DAYS);
        return {
            accessToken: (0, uuid_1.v4)(),
            refreshToken: (0, uuid_1.v4)(),
            expiresAt: expiresAt.toISOString(),
        };
    };
    return AuthService;
}());
exports.AuthService = AuthService;
