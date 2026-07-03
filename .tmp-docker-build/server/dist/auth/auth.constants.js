"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_ACCESS_TOKEN_TTL_DAYS = exports.AUTH_ACCESS_TOKEN_TTL = void 0;
exports.resolveJwtSecret = resolveJwtSecret;
require("dotenv/config");
exports.AUTH_ACCESS_TOKEN_TTL = '7d';
exports.AUTH_ACCESS_TOKEN_TTL_DAYS = 7;
function resolveJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not configured.');
    }
    return secret;
}
//# sourceMappingURL=auth.constants.js.map