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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPlansController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const commit_user_plan_log_dto_1 = require("./dto/commit-user-plan-log.dto");
const create_user_plan_dto_1 = require("./dto/create-user-plan.dto");
const get_user_plans_dto_1 = require("./dto/get-user-plans.dto");
const user_plans_service_1 = require("./user-plans.service");
let UserPlansController = class UserPlansController {
    constructor(userPlansService) {
        this.userPlansService = userPlansService;
    }
    async getActiveByUserId(user) {
        return this.userPlansService.getActiveByUserId(user.id);
    }
    async getCompletionRate(user) {
        return this.userPlansService.getCompletionRateSummary(user.id);
    }
    async getById(id, user) {
        return this.userPlansService.getById(id, user.id);
    }
    async getByUserId(user, query) {
        return this.userPlansService.getByUserId(user.id, query);
    }
    async create(dto, user) {
        return this.userPlansService.create(dto, user.id);
    }
    async appendLog(id, dto, user) {
        return this.userPlansService.appendLog(id, dto, user.id);
    }
    async resume(id, user) {
        return this.userPlansService.resume(id, user.id);
    }
    async archive(id, user) {
        return this.userPlansService.archive(id, user.id);
    }
};
exports.UserPlansController = UserPlansController;
__decorate([
    (0, common_1.Get)('active'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserPlansController.prototype, "getActiveByUserId", null);
__decorate([
    (0, common_1.Get)('completion-rate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserPlansController.prototype, "getCompletionRate", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserPlansController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_user_plans_dto_1.GetUserPlansDto]),
    __metadata("design:returntype", Promise)
], UserPlansController.prototype, "getByUserId", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_plan_dto_1.CreateUserPlanDto, Object]),
    __metadata("design:returntype", Promise)
], UserPlansController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/logs'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, commit_user_plan_log_dto_1.CommitUserPlanLogDto, Object]),
    __metadata("design:returntype", Promise)
], UserPlansController.prototype, "appendLog", null);
__decorate([
    (0, common_1.Post)(':id/resume'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserPlansController.prototype, "resume", null);
__decorate([
    (0, common_1.Post)(':id/archive'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserPlansController.prototype, "archive", null);
exports.UserPlansController = UserPlansController = __decorate([
    (0, common_1.Controller)('user-plans'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [user_plans_service_1.UserPlansService])
], UserPlansController);
//# sourceMappingURL=user-plans.controller.js.map