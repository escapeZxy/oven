"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const auth_constants_1 = require("./auth.constants");
const password_hasher_service_1 = require("./password-hasher.service");
const userProfileSelect = {
    id: true,
    username: true,
    email: true,
    displayName: true,
    createdAt: true,
};
let AuthService = class AuthService {
    constructor(prisma, jwtService, passwordHasher) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.passwordHasher = passwordHasher;
    }
    async register(dto) {
        const username = this.normalizeUsername(dto.username);
        const email = this.normalizeEmail(dto.email);
        const existing = await this.prisma.user.findFirst({
            where: {
                OR: [{ username }, { email }],
            },
            select: {
                id: true,
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Username or email already exists.');
        }
        const created = await this.prisma.user.create({
            data: {
                username,
                email,
                passwordHash: await this.passwordHasher.hash(dto.password),
                displayName: this.normalizeDisplayName(dto.displayName, dto.username),
            },
            select: userProfileSelect,
        });
        return this.buildAuthResponse(created);
    }
    async login(dto) {
        const identifier = dto.identifier.trim().toLowerCase();
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [{ username: identifier }, { email: identifier }],
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials.');
        }
        const isValid = await this.passwordHasher.verify(dto.password, user.passwordHash);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid credentials.');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                lastLoginAt: new Date(),
            },
        });
        return this.buildAuthResponse(user);
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: userProfileSelect,
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Authenticated user no longer exists.');
        }
        return this.mapUserProfile(user);
    }
    async restoreSession(accessToken) {
        const session = await this.getSessionRecord(accessToken);
        return {
            expiresAt: session.expiresAt.toISOString(),
            user: this.mapUserProfile(session.user),
        };
    }
    async logout(accessToken) {
        const tokenHash = this.hashAccessToken(accessToken);
        await this.prisma.authSession.deleteMany({
            where: { tokenHash },
        });
    }
    async validateAccessToken(accessToken) {
        const payload = await this.jwtService.verifyAsync(accessToken);
        const session = await this.getSessionRecord(accessToken);
        if (session.user.id !== payload.sub || session.user.email !== payload.email) {
            throw new common_1.UnauthorizedException('Authenticated session does not match token payload.');
        }
        await this.prisma.authSession.update({
            where: { id: session.id },
            data: { lastSeenAt: new Date() },
        });
        return {
            id: session.user.id,
            email: session.user.email,
        };
    }
    async buildAuthResponse(user) {
        const accessToken = await this.jwtService.signAsync({
            sub: user.id,
            email: user.email,
        });
        const expiresAt = this.buildAccessTokenExpiryDate();
        await this.prisma.authSession.create({
            data: {
                userId: user.id,
                tokenHash: this.hashAccessToken(accessToken),
                expiresAt,
            },
        });
        return {
            accessToken,
            expiresAt: expiresAt.toISOString(),
            user: this.mapUserProfile(user),
        };
    }
    mapUserProfile(user) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            displayName: user.displayName,
            createdAt: user.createdAt.toISOString(),
        };
    }
    normalizeUsername(value) {
        return value.trim().toLowerCase();
    }
    normalizeEmail(value) {
        return value.trim().toLowerCase();
    }
    normalizeDisplayName(displayName, username) {
        const normalized = displayName === null || displayName === void 0 ? void 0 : displayName.trim();
        if (normalized) {
            return normalized;
        }
        return username.trim();
    }
    buildAccessTokenExpiryDate() {
        return new Date(Date.now() + auth_constants_1.AUTH_ACCESS_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
    }
    hashAccessToken(accessToken) {
        return (0, node_crypto_1.createHash)('sha256').update(accessToken).digest('hex');
    }
    async getSessionRecord(accessToken) {
        const tokenHash = this.hashAccessToken(accessToken);
        const session = await this.prisma.authSession.findUnique({
            where: { tokenHash },
            include: {
                user: {
                    select: userProfileSelect,
                },
            },
        });
        if (!session) {
            throw new common_1.UnauthorizedException('Authenticated session not found.');
        }
        if (session.expiresAt.getTime() <= Date.now()) {
            await this.prisma.authSession.delete({
                where: { id: session.id },
            });
            throw new common_1.UnauthorizedException('Authenticated session has expired.');
        }
        return session;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        password_hasher_service_1.PasswordHasherService])
], AuthService);
//# sourceMappingURL=auth.service.js.map