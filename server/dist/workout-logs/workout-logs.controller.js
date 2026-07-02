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
exports.WorkoutLogsController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_workout_log_dto_1 = require("./dto/create-workout-log.dto");
const get_exercise_trends_dto_1 = require("./dto/get-exercise-trends.dto");
const get_workout_logs_dto_1 = require("./dto/get-workout-logs.dto");
const get_workout_volume_dto_1 = require("./dto/get-workout-volume.dto");
const workout_logs_service_1 = require("./workout-logs.service");
let WorkoutLogsController = class WorkoutLogsController {
    constructor(workoutLogsService) {
        this.workoutLogsService = workoutLogsService;
    }
    async getVolume(user, query) {
        return this.workoutLogsService.getVolumeSummary(user.id, query);
    }
    async getExerciseTrends(user, query) {
        return this.workoutLogsService.getExerciseTrendSummary(user.id, query);
    }
    async getLastLogByExercise(user, exerciseId) {
        if (!exerciseId) {
            throw new common_1.BadRequestException('Query param "exerciseId" is required.');
        }
        return this.workoutLogsService.getLastLogByExercise(user.id, exerciseId);
    }
    async getByUserId(user, query) {
        return this.workoutLogsService.getByUserId(user.id, query);
    }
    async getById(id, user) {
        return this.workoutLogsService.getById(id, user.id);
    }
    async create(user, dto) {
        return this.workoutLogsService.create(user.id, dto);
    }
};
exports.WorkoutLogsController = WorkoutLogsController;
__decorate([
    (0, common_1.Get)('volume'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_workout_volume_dto_1.GetWorkoutVolumeDto]),
    __metadata("design:returntype", Promise)
], WorkoutLogsController.prototype, "getVolume", null);
__decorate([
    (0, common_1.Get)('exercise-trends'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_exercise_trends_dto_1.GetExerciseTrendsDto]),
    __metadata("design:returntype", Promise)
], WorkoutLogsController.prototype, "getExerciseTrends", null);
__decorate([
    (0, common_1.Get)('last'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('exerciseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WorkoutLogsController.prototype, "getLastLogByExercise", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, get_workout_logs_dto_1.GetWorkoutLogsDto]),
    __metadata("design:returntype", Promise)
], WorkoutLogsController.prototype, "getByUserId", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorkoutLogsController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_workout_log_dto_1.CreateWorkoutLogDto]),
    __metadata("design:returntype", Promise)
], WorkoutLogsController.prototype, "create", null);
exports.WorkoutLogsController = WorkoutLogsController = __decorate([
    (0, common_1.Controller)('workout-logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [workout_logs_service_1.WorkoutLogsService])
], WorkoutLogsController);
//# sourceMappingURL=workout-logs.controller.js.map