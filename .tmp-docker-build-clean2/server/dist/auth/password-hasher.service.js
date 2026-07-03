"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordHasherService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const node_util_1 = require("node:util");
const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const scryptAsync = (0, node_util_1.promisify)(node_crypto_1.scrypt);
let PasswordHasherService = class PasswordHasherService {
    async hash(password) {
        const salt = (0, node_crypto_1.randomBytes)(SALT_BYTES).toString('hex');
        const derivedKey = (await scryptAsync(password, salt, KEY_LENGTH));
        return `${salt}:${derivedKey.toString('hex')}`;
    }
    async verify(password, storedHash) {
        const [salt, expectedHash] = this.parseStoredHash(storedHash);
        if (!salt || !expectedHash) {
            return false;
        }
        const actualHash = (await scryptAsync(password, salt, KEY_LENGTH));
        return (0, node_crypto_1.timingSafeEqual)(actualHash, Buffer.from(expectedHash, 'hex'));
    }
    parseStoredHash(storedHash) {
        if (storedHash.includes('$')) {
            const [, salt, expectedHash] = storedHash.split('$');
            return [salt, expectedHash];
        }
        return storedHash.split(':', 2);
    }
};
exports.PasswordHasherService = PasswordHasherService;
exports.PasswordHasherService = PasswordHasherService = __decorate([
    (0, common_1.Injectable)()
], PasswordHasherService);
//# sourceMappingURL=password-hasher.service.js.map