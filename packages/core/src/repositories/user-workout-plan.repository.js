"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryUserWorkoutPlanRepository = void 0;
const uuid_1 = require("uuid");
const MOCK_USER_WORKOUT_PLANS = [
    {
        id: 'user-plan-1',
        userId: 'user-1',
        workoutPlanId: 'plan-1',
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        currentDayIndex: 4,
        isActive: true,
        status: 'active',
        isArchived: false,
        logHistory: [
            {
                id: 'log-1',
                userId: 'user-1',
                workoutPlanId: 'plan-1',
                trainingDayId: 'day-1',
                date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'completed',
                completedExercises: [],
            },
            {
                id: 'log-2',
                userId: 'user-1',
                workoutPlanId: 'plan-1',
                trainingDayId: 'day-3',
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'completed',
                completedExercises: [],
            },
        ],
    },
    {
        id: 'user-plan-2',
        userId: 'user-1',
        workoutPlanId: 'plan-2',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        currentDayIndex: 48,
        isActive: false,
        status: 'completed',
        isArchived: false,
        logHistory: [],
    },
];
class InMemoryUserWorkoutPlanRepository {
    constructor() {
        this.userPlans = MOCK_USER_WORKOUT_PLANS;
    }
    async create(planData) {
        const newPlan = Object.assign({ id: (0, uuid_1.v4)() }, planData);
        this.userPlans.push(newPlan);
        return newPlan;
    }
    async findById(id) {
        return this.userPlans.find(plan => plan.id === id) || null;
    }
    async findByUserId(userId) {
        return this.userPlans.filter(plan => plan.userId === userId);
    }
    async findActiveByUserId(userId) {
        return this.userPlans.find(plan => plan.userId === userId && plan.isActive) || null;
    }
    async update(plan) {
        const existingIndex = this.userPlans.findIndex(p => p.id === plan.id);
        if (existingIndex === -1) {
            return null;
        }
        this.userPlans = [
            ...this.userPlans.slice(0, existingIndex),
            plan,
            ...this.userPlans.slice(existingIndex + 1)
        ];
        return plan;
    }
    async delete(id) {
        const initialLength = this.userPlans.length;
        this.userPlans = this.userPlans.filter(plan => plan.id !== id);
        return this.userPlans.length < initialLength;
    }
    async deactivateAllUserPlans(userId) {
        this.userPlans = this.userPlans.map(plan => plan.userId === userId ? Object.assign(Object.assign({}, plan), { isActive: false }) : plan);
    }
}
exports.InMemoryUserWorkoutPlanRepository = InMemoryUserWorkoutPlanRepository;
//# sourceMappingURL=user-workout-plan.repository.js.map