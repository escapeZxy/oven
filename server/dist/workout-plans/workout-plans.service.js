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
exports.WorkoutPlansService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const workout_plan_normalizer_1 = require("./workout-plan-normalizer");
let WorkoutPlansService = class WorkoutPlansService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAll(query = {}) {
        const plans = await this.prisma.workoutPlan.findMany({
            where: query.updatedAfter
                ? {
                    updatedAt: {
                        gte: new Date(query.updatedAfter),
                    },
                }
                : undefined,
            orderBy: [{ updatedAt: 'asc' }, { id: 'asc' }],
            take: query.limit,
        });
        return plans.map((plan) => this.mapWorkoutPlan(plan));
    }
    async getById(id) {
        const plan = await this.prisma.workoutPlan.findUnique({
            where: { id },
        });
        if (!plan) {
            throw new common_1.NotFoundException(`Workout plan "${id}" not found.`);
        }
        return this.mapWorkoutPlan(plan);
    }
    async create(dto) {
        const normalized = (0, workout_plan_normalizer_1.normalizeWorkoutPlanStructure)((0, node_crypto_1.randomUUID)(), {
            schedule: dto.schedule,
            trainingDays: dto.trainingDays,
        });
        const created = await this.prisma.workoutPlan.create({
            data: Object.assign(Object.assign({ name: dto.name, description: dto.description }, (normalized.schedule !== undefined
                ? {
                    schedule: normalized.schedule,
                }
                : {})), (normalized.trainingDays !== undefined
                ? {
                    trainingDays: normalized.trainingDays,
                }
                : {})),
        });
        return this.mapWorkoutPlan(created);
    }
    mapWorkoutPlan(plan) {
        const normalized = (0, workout_plan_normalizer_1.normalizeWorkoutPlanStructure)(plan.id, {
            schedule: this.readSchedule(plan.schedule),
            trainingDays: this.readTrainingDays(plan.trainingDays),
        });
        return {
            id: plan.id,
            name: plan.name,
            description: plan.description,
            createdAt: plan.createdAt.toISOString(),
            updatedAt: plan.updatedAt.toISOString(),
            schedule: normalized.schedule,
            trainingDays: normalized.trainingDays,
        };
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
            return undefined;
        }
        if (!Array.isArray(value)) {
            throw new Error('Invalid workout plan trainingDays stored in database.');
        }
        return value;
    }
};
exports.WorkoutPlansService = WorkoutPlansService;
exports.WorkoutPlansService = WorkoutPlansService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkoutPlansService);
//# sourceMappingURL=workout-plans.service.js.map