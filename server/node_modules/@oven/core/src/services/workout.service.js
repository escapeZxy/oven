"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutService = void 0;
const uuid_1 = require("uuid");
class WorkoutService {
    constructor(userWorkoutPlanRepository, workoutPlanRepository, workoutLogRepository) {
        this.userWorkoutPlanRepository = userWorkoutPlanRepository;
        this.workoutPlanRepository = workoutPlanRepository;
        this.workoutLogRepository = workoutLogRepository;
    }
    async getLastExerciseLog(userId, exerciseId) {
        return this.workoutLogRepository.getLastLog(userId, exerciseId);
    }
    async getAllLogs(userId) {
        return this.workoutLogRepository.findAllByUserId(userId);
    }
    async startPlan(userId, workoutPlanId) {
        const workoutPlan = await this.workoutPlanRepository.findById(workoutPlanId);
        if (!workoutPlan) {
            throw new Error('Workout plan not found');
        }
        await this.deactivateAllUserPlans(userId);
        const newUserPlan = {
            userId,
            workoutPlanId: workoutPlan.id,
            startDate: new Date().toISOString(),
            currentDayIndex: 0,
            isActive: true,
            status: 'active',
            logHistory: [],
        };
        return this.userWorkoutPlanRepository.create(newUserPlan);
    }
    async resumePlan(userId, userPlanId) {
        const userPlan = await this.userWorkoutPlanRepository.findById(userPlanId);
        if (!userPlan) {
            throw new Error('User workout plan not found');
        }
        await this.deactivateAllUserPlans(userId);
        const updatedPlan = Object.assign(Object.assign({}, userPlan), { isActive: true, status: 'active' });
        const saved = await this.userWorkoutPlanRepository.update(updatedPlan);
        if (!saved) {
            throw new Error('Failed to update plan status');
        }
        return saved;
    }
    async archivePlan(userPlanId) {
        const userPlan = await this.userWorkoutPlanRepository.findById(userPlanId);
        if (!userPlan) {
            throw new Error('User workout plan not found');
        }
        if (userPlan.status === 'active' || userPlan.isActive) {
            throw new Error('Cannot archive an active plan');
        }
        const updatedPlan = Object.assign(Object.assign({}, userPlan), { isArchived: true });
        const saved = await this.userWorkoutPlanRepository.update(updatedPlan);
        if (!saved) {
            throw new Error('Failed to archive plan');
        }
        return saved;
    }
    async deactivateAllUserPlans(userId) {
        const activePlan = await this.userWorkoutPlanRepository.findActiveByUserId(userId);
        if (activePlan) {
            const updated = Object.assign(Object.assign({}, activePlan), { isActive: false, status: 'interrupted' });
            await this.userWorkoutPlanRepository.update(updated);
        }
    }
    async logWorkout(userWorkoutPlanId, completedExercises) {
        const currentPlan = await this.userWorkoutPlanRepository.findById(userWorkoutPlanId);
        if (!currentPlan) {
            throw new Error('User workout plan not found');
        }
        const workoutPlan = await this.workoutPlanRepository.findById(currentPlan.workoutPlanId);
        if (!workoutPlan) {
            throw new Error('Workout plan not found');
        }
        const updatedPlan = this._updatePlanWithNewLog(currentPlan, workoutPlan, 'completed', completedExercises);
        const savedPlan = await this.userWorkoutPlanRepository.update(updatedPlan);
        if (!savedPlan) {
            throw new Error('Failed to update user workout plan');
        }
        const lastLog = updatedPlan.logHistory[updatedPlan.logHistory.length - 1];
        await this.workoutLogRepository.create(lastLog);
        return savedPlan;
    }
    async skipDay(userWorkoutPlanId) {
        const currentPlan = await this.userWorkoutPlanRepository.findById(userWorkoutPlanId);
        if (!currentPlan) {
            throw new Error('User workout plan not found');
        }
        const workoutPlan = await this.workoutPlanRepository.findById(currentPlan.workoutPlanId);
        if (!workoutPlan) {
            throw new Error('Workout plan not found');
        }
        const updatedPlan = this._updatePlanWithNewLog(currentPlan, workoutPlan, 'skipped', []);
        const savedPlan = await this.userWorkoutPlanRepository.update(updatedPlan);
        if (!savedPlan) {
            throw new Error('Failed to update user workout plan');
        }
        const lastLog = updatedPlan.logHistory[updatedPlan.logHistory.length - 1];
        await this.workoutLogRepository.create(lastLog);
        return savedPlan;
    }
    async getActivePlan(userId) {
        return this.userWorkoutPlanRepository.findActiveByUserId(userId);
    }
    async getAllPlans(userId) {
        return this.userWorkoutPlanRepository.findByUserId(userId);
    }
    async getPlanDefinitions() {
        return this.workoutPlanRepository.findAll();
    }
    async createPlanDefinition(planData) {
        return this.workoutPlanRepository.create(planData);
    }
    flattenPlan(plan) {
        if (!plan.schedule || plan.schedule.length === 0) {
            return plan.trainingDays || [];
        }
        return this._flattenScheduleItems(plan.schedule);
    }
    _flattenScheduleItems(items) {
        const flattened = [];
        for (const item of items) {
            if ('type' in item && item.type === 'cycle') {
                const cycleDays = this._flattenScheduleItems(item.items);
                for (let i = 0; i < item.repeats; i++) {
                    flattened.push(...cycleDays);
                }
            }
            else {
                flattened.push(item);
            }
        }
        return flattened;
    }
    _updatePlanWithNewLog(currentPlan, workoutPlan, status, completedExercises) {
        const allDays = this.flattenPlan(workoutPlan);
        const currentDay = allDays[currentPlan.currentDayIndex];
        if (!currentDay) {
            throw new Error(`Invalid currentDayIndex: ${currentPlan.currentDayIndex}`);
        }
        const trainingDayId = currentDay.id;
        const newLog = {
            id: (0, uuid_1.v4)(),
            userId: currentPlan.userId,
            workoutPlanId: currentPlan.workoutPlanId,
            trainingDayId,
            date: new Date().toISOString(),
            status,
            completedExercises,
        };
        const isLastDay = currentPlan.currentDayIndex === allDays.length - 1;
        return Object.assign(Object.assign({}, currentPlan), { currentDayIndex: currentPlan.currentDayIndex + 1, logHistory: [...currentPlan.logHistory, newLog], isActive: !isLastDay, status: isLastDay ? 'completed' : 'active' });
    }
}
exports.WorkoutService = WorkoutService;
//# sourceMappingURL=workout.service.js.map