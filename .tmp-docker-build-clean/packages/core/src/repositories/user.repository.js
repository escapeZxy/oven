"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const uuid_1 = require("uuid");
class UserRepository {
    constructor() {
        this.users = [];
    }
    async create(userData) {
        const newUser = Object.assign(Object.assign({ id: (0, uuid_1.v4)() }, userData), { createdAt: new Date().toISOString() });
        this.users.push(newUser);
        return newUser;
    }
    async findById(id) {
        return this.users.find(user => user.id === id) || null;
    }
    async findByEmail(email) {
        return this.users.find(user => user.email === email) || null;
    }
    async findByUsername(username) {
        return this.users.find(user => user.username === username) || null;
    }
    async update(user) {
        const existingIndex = this.users.findIndex(u => u.id === user.id);
        if (existingIndex === -1) {
            return null;
        }
        this.users = [
            ...this.users.slice(0, existingIndex),
            user,
            ...this.users.slice(existingIndex + 1)
        ];
        return user;
    }
    async delete(id) {
        const initialLength = this.users.length;
        this.users = this.users.filter(user => user.id !== id);
        return this.users.length < initialLength;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map