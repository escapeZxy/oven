"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DexieUserWorkoutPlanRepository = void 0;
const uuid_1 = require("uuid");
const app_database_1 = require("./app.database");
class DexieUserWorkoutPlanRepository {
    async create(planData) {
        const newPlan = Object.assign({ id: (0, uuid_1.v4)() }, planData);
        await app_database_1.db.userWorkoutPlans.add(newPlan);
        return newPlan;
    }
    async findById(id) {
        const plan = await app_database_1.db.userWorkoutPlans.get(id);
        return plan || null;
    }
    async findByUserId(userId) {
        return await app_database_1.db.userWorkoutPlans
            .where('userId')
            .equals(userId)
            .toArray();
    }
    async findActiveByUserId(userId) {
        const plans = await app_database_1.db.userWorkoutPlans
            .where('userId')
            .equals(userId)
            .filter(plan => plan.isActive)
            .toArray();
        return plans.length > 0 ? plans[0] : null;
    }
    async update(plan) {
        await app_database_1.db.userWorkoutPlans.put(plan);
        return plan;
    }
    async delete(id) {
        await app_database_1.db.userWorkoutPlans.delete(id);
        return true;
    }
    async deactivateAllUserPlans(userId) {
        const activePlans = await app_database_1.db.userWorkoutPlans
            .where('userId')
            .equals(userId)
            .filter(plan => plan.isActive)
            .toArray();
        const updates = activePlans.map(plan => app_database_1.db.userWorkoutPlans.update(plan.id, { isActive: false }));
        await Promise.all(updates);
    }
}
exports.DexieUserWorkoutPlanRepository = DexieUserWorkoutPlanRepository;
//# sourceMappingURL=dexie-user-workout-plan.repository.js.map