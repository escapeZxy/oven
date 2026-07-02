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
exports.UserPlansService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("../generated/prisma/client");
const userPlanWithLogs = {
    logs: {
        orderBy: {
            date: 'desc',
        },
    },
};
const idempotentCommitLogSelect = {
    id: true,
    clientRequestId: true,
    userPlanId: true,
    userId: true,
    workoutPlanId: true,
    trainingDayId: true,
    status: true,
    completedExercises: true,
};
let UserPlansService = class UserPlansService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getById(id, userId) {
        const plan = await this.prisma.userWorkoutPlan.findFirst({
            where: { id, userId },
            include: userPlanWithLogs,
        });
        if (!plan) {
            throw new common_1.NotFoundException(`User workout plan "${id}" not found.`);
        }
        return this.mapUserPlan(plan);
    }
    async getByUserId(userId, query = {}) {
        const plans = await this.prisma.userWorkoutPlan.findMany({
            where: Object.assign({ userId }, (query.updatedAfter
                ? {
                    updatedAt: {
                        gte: new Date(query.updatedAfter),
                    },
                }
                : {})),
            include: userPlanWithLogs,
            orderBy: [{ updatedAt: 'asc' }, { id: 'asc' }],
            take: query.limit,
        });
        return plans.map((plan) => this.mapUserPlan(plan));
    }
    async getActiveByUserId(userId) {
        const plan = await this.prisma.userWorkoutPlan.findFirst({
            where: {
                userId,
                status: client_1.UserWorkoutPlanStatus.active,
            },
            include: userPlanWithLogs,
            orderBy: { startDate: 'desc' },
        });
        return plan ? this.mapUserPlan(plan) : null;
    }
    async getCompletionRateSummary(userId) {
        const plans = await this.prisma.userWorkoutPlan.findMany({
            where: {
                userId,
                isArchived: false,
            },
            select: {
                status: true,
            },
        });
        const completedPlanCount = plans.filter((plan) => plan.status === client_1.UserWorkoutPlanStatus.completed).length;
        const interruptedPlanCount = plans.filter((plan) => plan.status === client_1.UserWorkoutPlanStatus.interrupted).length;
        const activePlanCount = plans.filter((plan) => plan.status === client_1.UserWorkoutPlanStatus.active).length;
        const closedPlanCount = completedPlanCount + interruptedPlanCount;
        return {
            completionRate: closedPlanCount === 0 ? 0 : (completedPlanCount / closedPlanCount) * 100,
            completedPlanCount,
            interruptedPlanCount,
            activePlanCount,
            closedPlanCount,
        };
    }
    async create(dto, userId) {
        const state = this.normalizePlanState(dto.status, dto.isActive);
        const createdId = await this.prisma.$transaction(async (prisma) => {
            var _a, _b;
            if (state.status === client_1.UserWorkoutPlanStatus.active) {
                await prisma.userWorkoutPlan.updateMany({
                    where: {
                        userId,
                        status: client_1.UserWorkoutPlanStatus.active,
                    },
                    data: {
                        status: client_1.UserWorkoutPlanStatus.interrupted,
                        isActive: false,
                    },
                });
            }
            const plan = await prisma.userWorkoutPlan.create({
                data: {
                    userId,
                    workoutPlanId: dto.workoutPlanId,
                    startDate: dto.startDate ? new Date(dto.startDate) : new Date(),
                    currentDayIndex: (_a = dto.currentDayIndex) !== null && _a !== void 0 ? _a : 0,
                    status: state.status,
                    isArchived: (_b = dto.isArchived) !== null && _b !== void 0 ? _b : false,
                    isActive: state.isActive,
                },
            });
            return plan.id;
        });
        return this.getById(createdId, userId);
    }
    async appendLog(id, dto, userId) {
        const replayedCommit = await this.tryResolveIdempotentReplay(id, dto, userId);
        if (replayedCommit) {
            return replayedCommit;
        }
        const existing = await this.requireOwnedUserPlan(id, userId);
        this.validatePlanOwnership(existing, dto.workoutPlanId);
        if (existing.status !== client_1.UserWorkoutPlanStatus.active) {
            this.throwCommitConflict({
                code: 'user_plan_inactive',
                message: `User workout plan "${id}" is no longer active.`,
                recoveryAction: 'return_dashboard',
            });
        }
        if (existing.currentDayIndex !== dto.expectedCurrentDayIndex) {
            this.throwCommitConflict({
                code: 'user_plan_day_advanced',
                message: `User workout plan "${id}" is already at day index ${existing.currentDayIndex}.`,
                recoveryAction: 'refresh_session',
                details: {
                    serverCurrentDayIndex: existing.currentDayIndex,
                    submittedExpectedDayIndex: dto.expectedCurrentDayIndex,
                },
            });
        }
        if (dto.nextDayIndex !== existing.currentDayIndex + 1) {
            throw new common_1.BadRequestException(`User workout plan "${id}" must advance exactly one day per commit.`);
        }
        const commitBoundary = await this.resolveCommitBoundary(existing);
        if (dto.trainingDayId !== commitBoundary.currentTrainingDay.id) {
            this.throwCommitConflict({
                code: 'training_day_mismatch',
                message: `User workout plan "${id}" expects trainingDayId "${commitBoundary.currentTrainingDay.id}" at day index ${existing.currentDayIndex}.`,
                recoveryAction: 'refresh_session',
                details: {
                    expectedTrainingDayId: commitBoundary.currentTrainingDay.id,
                    submittedTrainingDayId: dto.trainingDayId,
                    currentDayIndex: existing.currentDayIndex,
                },
            });
        }
        if (dto.userPlanStatus !== commitBoundary.nextStatus || dto.isActive !== commitBoundary.nextIsActive) {
            this.throwCommitConflict({
                code: 'plan_commit_boundary_changed',
                message: `User workout plan "${id}" must commit with status "${commitBoundary.nextStatus}" and isActive=${commitBoundary.nextIsActive}.`,
                recoveryAction: 'refresh_session',
                details: {
                    expectedUserPlanStatus: commitBoundary.nextStatus,
                    submittedUserPlanStatus: dto.userPlanStatus,
                    expectedIsActive: commitBoundary.nextIsActive,
                    submittedIsActive: dto.isActive,
                },
            });
        }
        if (dto.logStatus === client_1.WorkoutLogStatus.skipped && dto.completedExercises.length > 0) {
            throw new common_1.BadRequestException('Skipped workout logs must not include completed exercise payload.');
        }
        if (dto.logStatus === client_1.WorkoutLogStatus.completed) {
            this.validateCompletedExercises(dto.completedExercises);
        }
        try {
            await this.prisma.$transaction(async (prisma) => {
                await prisma.workoutLog.create({
                    data: {
                        clientRequestId: dto.clientRequestId,
                        userPlanId: id,
                        userId,
                        workoutPlanId: dto.workoutPlanId,
                        trainingDayId: dto.trainingDayId,
                        date: dto.date ? new Date(dto.date) : new Date(),
                        status: dto.logStatus,
                        completedExercises: dto.completedExercises,
                    },
                });
                await prisma.userWorkoutPlan.update({
                    where: { id },
                    data: {
                        currentDayIndex: dto.nextDayIndex,
                        status: dto.userPlanStatus,
                        isActive: dto.isActive,
                    },
                });
            });
        }
        catch (error) {
            if (this.isClientRequestIdConflict(error)) {
                const concurrentReplay = await this.tryResolveIdempotentReplay(id, dto, userId);
                if (concurrentReplay) {
                    return concurrentReplay;
                }
            }
            throw error;
        }
        return this.getById(id, userId);
    }
    async resume(id, userId) {
        const existing = await this.requireOwnedUserPlan(id, userId);
        if (existing.isArchived) {
            throw new common_1.BadRequestException(`Archived user workout plan "${id}" cannot be resumed.`);
        }
        if (existing.status === client_1.UserWorkoutPlanStatus.completed) {
            throw new common_1.BadRequestException(`Completed user workout plan "${id}" cannot be resumed. Start a new plan instance instead.`);
        }
        if (existing.status === client_1.UserWorkoutPlanStatus.active && existing.isActive) {
            return this.getById(id, userId);
        }
        await this.prisma.$transaction(async (prisma) => {
            await prisma.userWorkoutPlan.updateMany({
                where: {
                    userId: existing.userId,
                    id: { not: id },
                    status: client_1.UserWorkoutPlanStatus.active,
                },
                data: {
                    status: client_1.UserWorkoutPlanStatus.interrupted,
                    isActive: false,
                },
            });
            await prisma.userWorkoutPlan.update({
                where: { id },
                data: {
                    status: client_1.UserWorkoutPlanStatus.active,
                    isActive: true,
                },
            });
        });
        return this.getById(id, userId);
    }
    async archive(id, userId) {
        const existing = await this.requireOwnedUserPlan(id, userId);
        this.ensureArchivable(existing);
        if (existing.isArchived) {
            return this.getById(id, userId);
        }
        await this.prisma.userWorkoutPlan.update({
            where: { id },
            data: {
                isArchived: true,
            },
        });
        return this.getById(id, userId);
    }
    async requireOwnedUserPlan(id, userId) {
        const existing = await this.prisma.userWorkoutPlan.findFirst({
            where: { id, userId },
            select: {
                id: true,
                userId: true,
                workoutPlanId: true,
                currentDayIndex: true,
                status: true,
                isActive: true,
                isArchived: true,
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException(`User workout plan "${id}" not found.`);
        }
        return existing;
    }
    validatePlanOwnership(plan, workoutPlanId) {
        if (plan.workoutPlanId !== workoutPlanId) {
            throw new common_1.BadRequestException('User workout plan does not match the submitted workoutPlanId.');
        }
    }
    async tryResolveIdempotentReplay(userPlanId, dto, userId) {
        if (!dto.clientRequestId) {
            return null;
        }
        const existingLog = await this.prisma.workoutLog.findUnique({
            where: {
                clientRequestId: dto.clientRequestId,
            },
            select: idempotentCommitLogSelect,
        });
        if (!existingLog) {
            return null;
        }
        this.assertReplayMatchesExistingCommit(existingLog, userPlanId, dto, userId);
        return this.getById(userPlanId, userId);
    }
    assertReplayMatchesExistingCommit(existingLog, userPlanId, dto, userId) {
        const matchesRequest = existingLog.userPlanId === userPlanId &&
            existingLog.userId === userId &&
            existingLog.workoutPlanId === dto.workoutPlanId &&
            existingLog.trainingDayId === dto.trainingDayId &&
            existingLog.status === dto.logStatus &&
            this.haveSameCompletedExercises(existingLog, dto.completedExercises);
        if (matchesRequest) {
            return;
        }
        this.throwCommitConflict({
            code: 'client_request_reused',
            message: `clientRequestId "${dto.clientRequestId}" is already bound to a different workout commit.`,
            recoveryAction: 'return_dashboard',
        });
    }
    haveSameCompletedExercises(existingLog, submittedExercises) {
        return (JSON.stringify(this.readCompletedExercises(existingLog.completedExercises)) ===
            JSON.stringify(submittedExercises));
    }
    isClientRequestIdConflict(error) {
        if (typeof error !== 'object' ||
            error === null ||
            !('code' in error) ||
            error.code !== 'P2002' ||
            !('meta' in error)) {
            return false;
        }
        const meta = error.meta;
        if (typeof meta !== 'object' || meta === null || !('target' in meta)) {
            return false;
        }
        const target = meta.target;
        return Array.isArray(target) && target.includes('clientRequestId');
    }
    async resolveCommitBoundary(plan) {
        const workoutPlan = await this.prisma.workoutPlan.findUnique({
            where: { id: plan.workoutPlanId },
        });
        if (!workoutPlan) {
            throw new common_1.BadRequestException(`Referenced workout plan "${plan.workoutPlanId}" not found for user plan "${plan.id}".`);
        }
        const trainingDays = this.flattenWorkoutPlan(workoutPlan);
        const currentTrainingDay = trainingDays[plan.currentDayIndex];
        if (!currentTrainingDay) {
            this.throwCommitConflict({
                code: 'user_plan_out_of_range',
                message: `User workout plan "${plan.id}" currentDayIndex ${plan.currentDayIndex} is out of range.`,
                recoveryAction: 'return_dashboard',
                details: {
                    currentDayIndex: plan.currentDayIndex,
                },
            });
        }
        const isLastTrainingDay = plan.currentDayIndex === trainingDays.length - 1;
        return {
            currentTrainingDay,
            nextStatus: isLastTrainingDay
                ? client_1.UserWorkoutPlanStatus.completed
                : client_1.UserWorkoutPlanStatus.active,
            nextIsActive: !isLastTrainingDay,
        };
    }
    ensureArchivable(existing) {
        if (existing.status === client_1.UserWorkoutPlanStatus.active || existing.isActive) {
            throw new common_1.BadRequestException('Cannot archive an active plan.');
        }
    }
    throwCommitConflict(payload) {
        throw new common_1.ConflictException(payload);
    }
    normalizePlanState(status, isActive) {
        if (status !== undefined) {
            return {
                status,
                isActive: status === client_1.UserWorkoutPlanStatus.active,
            };
        }
        if (isActive !== undefined) {
            return {
                status: isActive ? client_1.UserWorkoutPlanStatus.active : client_1.UserWorkoutPlanStatus.interrupted,
                isActive,
            };
        }
        return {
            status: client_1.UserWorkoutPlanStatus.active,
            isActive: true,
        };
    }
    validateCompletedExercises(exercises) {
        if (exercises.length === 0) {
            throw new common_1.BadRequestException('Completed workout logs must include at least one completed set.');
        }
        for (const exercise of exercises) {
            if (exercise.sets <= 0) {
                throw new common_1.BadRequestException(`Exercise "${exercise.exerciseId}" must include at least one completed set.`);
            }
            if (exercise.reps.length !== exercise.sets ||
                exercise.weight.length !== exercise.sets) {
                throw new common_1.BadRequestException(`Exercise "${exercise.exerciseId}" has inconsistent completed set payload.`);
            }
        }
    }
    mapUserPlan(plan) {
        var _a, _b;
        return {
            id: plan.id,
            userId: plan.userId,
            workoutPlanId: plan.workoutPlanId,
            createdAt: ((_a = plan.createdAt) !== null && _a !== void 0 ? _a : plan.startDate).toISOString(),
            updatedAt: ((_b = plan.updatedAt) !== null && _b !== void 0 ? _b : plan.startDate).toISOString(),
            startDate: plan.startDate.toISOString(),
            currentDayIndex: plan.currentDayIndex,
            status: plan.status,
            isArchived: plan.isArchived,
            isActive: plan.isActive,
            logHistory: plan.logs.map((log) => this.mapWorkoutLog(log)),
        };
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
    flattenWorkoutPlan(plan) {
        const schedule = this.readSchedule(plan.schedule);
        if (schedule && schedule.length > 0) {
            return this.flattenScheduleItems(schedule);
        }
        return this.readTrainingDays(plan.trainingDays);
    }
    flattenScheduleItems(items) {
        const flattened = [];
        for (const item of items) {
            if ('type' in item && item.type === 'cycle') {
                const cycleDays = this.flattenScheduleItems(item.items);
                for (let index = 0; index < item.repeats; index += 1) {
                    flattened.push(...cycleDays);
                }
                continue;
            }
            flattened.push(item);
        }
        return flattened;
    }
    readSchedule(value) {
        if (value === null) {
            return undefined;
        }
        if (!Array.isArray(value)) {
            throw new Error('Invalid workout plan schedule stored in database.');
        }
        return value;
    }
    readTrainingDays(value) {
        if (value === null) {
            return [];
        }
        if (!Array.isArray(value)) {
            throw new Error('Invalid workout plan trainingDays stored in database.');
        }
        return value;
    }
    readCompletedExercises(value) {
        if (!Array.isArray(value)) {
            throw new Error('Invalid workout log payload stored in database.');
        }
        return value;
    }
};
exports.UserPlansService = UserPlansService;
exports.UserPlansService = UserPlansService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserPlansService);
//# sourceMappingURL=user-plans.service.js.map