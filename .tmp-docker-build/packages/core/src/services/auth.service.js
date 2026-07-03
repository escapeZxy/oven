"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const uuid_1 = require("uuid");
class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.TOKEN_EXPIRY_DAYS = 7;
    }
    async register(credentials, username, displayName) {
        const existingUser = await this.userRepository.findByEmail(credentials.email);
        if (existingUser) {
            throw new Error('Email already registered');
        }
        const existingUsername = await this.userRepository.findByUsername(username);
        if (existingUsername) {
            throw new Error('Username already taken');
        }
        const user = await this.userRepository.create({
            email: credentials.email,
            username,
            displayName,
        });
        const token = this.generateAuthToken();
        return { user, token };
    }
    async login(credentials) {
        const user = await this.userRepository.findByEmail(credentials.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const token = this.generateAuthToken();
        const updatedUser = await this.userRepository.update(Object.assign(Object.assign({}, user), { lastLoginAt: new Date().toISOString() }));
        return { user: updatedUser, token };
    }
    async logout(userId) {
        const user = await this.userRepository.findById(userId);
        if (user) {
            await this.userRepository.update(user);
        }
    }
    refreshToken(_refreshToken) {
        return this.generateAuthToken();
    }
    generateAuthToken() {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + this.TOKEN_EXPIRY_DAYS);
        return {
            accessToken: (0, uuid_1.v4)(),
            refreshToken: (0, uuid_1.v4)(),
            expiresAt: expiresAt.toISOString(),
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map