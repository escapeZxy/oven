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
exports.WorkoutLogsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("../generated/prisma/client");
let WorkoutLogsService = class WorkoutLogsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getVolumeSummary(userId, query) {
        var _a, _b;
        const bucket = (_a = query.bucket) !== null && _a !== void 0 ? _a : 'week';
        const limit = (_b = query.limit) !== null && _b !== void 0 ? _b : (bucket === 'week' ? 8 : 6);
        const completedLogs = await this.prisma.workoutLog.findMany({
            where: {
                userId,
                status: client_1.WorkoutLogStatus.completed,
            },
            orderBy: { date: 'asc' },
        });
        return {
            bucket,
            points: this.aggregateVolumePoints(completedLogs, bucket, limit),
        };
    }
    async getExerciseTrendSummary(userId, query) {
        var _a;
        const limit = (_a = query.limit) !== null && _a !== void 0 ? _a : 5;
        const completedLogs = await this.prisma.workoutLog.findMany({
            where: {
                userId,
                status: client_1.WorkoutLogStatus.completed,
            },
            orderBy: { date: 'desc' },
        });
        return {
            items: this.aggregateExerciseTrendItems(completedLogs, limit),
        };
    }
    async getById(id, userId) {
        const log = await this.prisma.workoutLog.findFirst({
            where: { id, userId },
        });
        if (!log) {
            throw new common_1.NotFoundException(`Workout log "${id}" not found.`);
        }
        return this.mapWorkoutLog(log);
    }
    async getByUserId(userId, query = {}) {
        const logs = await this.prisma.workoutLog.findMany({
            where: Object.assign({ userId }, (query.updatedAfter
                ? {
                    updatedAt: {
                        gte: new Date(query.updatedAfter),
                    },
                }
                : {})),
            orderBy: [{ updatedAt: 'asc' }, { id: 'asc' }],
            take: query.limit,
        });
        return logs.map((log) => this.mapWorkoutLog(log));
    }
    async getLastLogByExercise(userId, exerciseId) {
        const logs = await this.prisma.workoutLog.findMany({
            where: {
                userId,
                status: client_1.WorkoutLogStatus.completed,
            },
            orderBy: { date: 'desc' },
        });
        const matched = logs.find((log) => this.readCompletedExercises(log.completedExercises).some((exercise) => exercise.exerciseId === exerciseId));
        return matched ? this.mapWorkoutLog(matched) : null;
    }
    async create(_userId, dto) {
        throw new common_1.ConflictException(`Direct workout log creation is disabled for formal records. Use POST /user-plans/${dto.userPlanId}/logs to create the log and advance the plan atomically.`);
    }
    aggregateVolumePoints(logs, bucket, limit) {
        const now = new Date();
        const currentBucketStart = this.getBucketStart(now, bucket);
        const bucketStarts = Array.from({ length: limit }, (_, index) => this.shiftBucket(currentBucketStart, bucket, index - limit + 1));
        const points = new Map();
        for (const bucketStart of bucketStarts) {
            const nextBucketStart = this.shiftBucket(bucketStart, bucket, 1);
            points.set(bucketStart.toISOString(), {
                bucketStart: bucketStart.toISOString(),
                bucketEnd: new Date(nextBucketStart.getTime() - 1).toISOString(),
                volume: 0,
                completedLogCount: 0,
            });
        }
        for (const log of logs) {
            const bucketStart = this.getBucketStart(log.date, bucket).toISOString();
            const point = points.get(bucketStart);
            if (!point) {
                continue;
            }
            point.volume += this.calculateLogVolume(this.readCompletedExercises(log.completedExercises));
            point.completedLogCount += 1;
        }
        return bucketStarts
            .map((bucketStart) => points.get(bucketStart.toISOString()))
            .filter((point) => Boolean(point));
    }
    aggregateExerciseTrendItems(logs, limit) {
        const grouped = new Map();
        for (const log of logs) {
            const loggedAt = log.date.toISOString();
            for (const exercise of this.readCompletedExercises(log.completedExercises)) {
                const point = {
                    loggedAt,
                    volume: this.calculateExerciseVolume(exercise),
                };
                const points = grouped.get(exercise.exerciseId);
                if (points) {
                    points.push(point);
                    continue;
                }
                grouped.set(exercise.exerciseId, [point]);
            }
        }
        return Array.from(grouped.entries())
            .map(([exerciseId, points]) => this.createExerciseTrendItem(exerciseId, points))
            .sort((left, right) => new Date(right.latestLogAt).getTime() - new Date(left.latestLogAt).getTime())
            .slice(0, limit);
    }
    createExerciseTrendItem(exerciseId, points) {
        var _a, _b;
        const orderedPoints = [...points].sort((left, right) => new Date(left.loggedAt).getTime() - new Date(right.loggedAt).getTime());
        const recentPoints = orderedPoints.slice(-4);
        const latestPoint = recentPoints.at(-1);
        if (!latestPoint) {
            throw new Error(`Exercise trend "${exerciseId}" must contain at least one point.`);
        }
        const previousPoint = (_a = recentPoints.at(-2)) !== null && _a !== void 0 ? _a : null;
        const latestVolume = latestPoint.volume;
        const previousVolume = (_b = previousPoint === null || previousPoint === void 0 ? void 0 : previousPoint.volume) !== null && _b !== void 0 ? _b : null;
        const changeVolume = previousVolume === null ? null : latestVolume - previousVolume;
        return {
            exerciseId,
            latestLogAt: latestPoint.loggedAt,
            latestVolume,
            previousVolume,
            changeVolume,
            changeRate: this.calculateChangeRate(latestVolume, previousVolume),
            direction: this.resolveTrendDirection(latestVolume, previousVolume),
            sessionCount: orderedPoints.length,
            points: recentPoints,
        };
    }
    calculateLogVolume(exercises) {
        return exercises.reduce((total, exercise) => {
            return total + this.calculateExerciseVolume(exercise);
        }, 0);
    }
    calculateExerciseVolume(exercise) {
        return exercise.weight.reduce((exerciseTotal, weight, index) => { var _a; return exerciseTotal + weight * ((_a = exercise.reps[index]) !== null && _a !== void 0 ? _a : 0); }, 0);
    }
    calculateChangeRate(latestVolume, previousVolume) {
        if (previousVolume === null || previousVolume === 0) {
            return null;
        }
        return ((latestVolume - previousVolume) / previousVolume) * 100;
    }
    resolveTrendDirection(latestVolume, previousVolume) {
        if (previousVolume === null) {
            return 'new';
        }
        if (latestVolume > previousVolume) {
            return 'up';
        }
        if (latestVolume < previousVolume) {
            return 'down';
        }
        return 'stable';
    }
    getBucketStart(date, bucket) {
        const normalized = new Date(date);
        normalized.setUTCHours(0, 0, 0, 0);
        if (bucket === 'month') {
            return new Date(Date.UTC(normalized.getUTCFullYear(), normalized.getUTCMonth(), 1));
        }
        const day = normalized.getUTCDay();
        const diff = normalized.getUTCDate() - day + (day === 0 ? -6 : 1);
        return new Date(Date.UTC(normalized.getUTCFullYear(), normalized.getUTCMonth(), diff));
    }
    shiftBucket(date, bucket, offset) {
        if (bucket === 'month') {
            return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + offset, 1));
        }
        return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + offset * 7));
    }
    mapWorkoutLog(log) {
        var _a, _b;
        return {
            id: log.id,
            userId: log.userId,
            workoutPlanId: log.workoutPlanId,
            trainingDayId: log.trainingDayId,
            createdAt: ((_a = log.createdAt) !== null && _a !== void 0 ? _a : log.date).toISOString(),
            updatedAt: ((_b = log.updatedAt) !== null && _b !== void 0 ? _b : log.date).toISOString(),
            date: log.date.toISOString(),
            status: log.status,
            completedExercises: this.readCompletedExercises(log.completedExercises),
        };
    }
    readCompletedExercises(value) {
        if (!Array.isArray(value)) {
            throw new Error('Invalid workout log payload stored in database.');
        }
        return value;
    }
};
exports.WorkoutLogsService = WorkoutLogsService;
exports.WorkoutLogsService = WorkoutLogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkoutLogsService);
//# sourceMappingURL=workout-logs.service.js.map