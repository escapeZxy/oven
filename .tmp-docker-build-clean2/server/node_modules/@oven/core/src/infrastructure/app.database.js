"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.AppDatabase = void 0;
const dexie_1 = require("dexie");
class AppDatabase extends dexie_1.default {
    constructor() {
        super('OvenDB');
        this.version(2).stores({
            userWorkoutPlans: 'id, userId, workoutPlanId',
            workoutLogs: '++id, userId, *completedExercises.exerciseId, date',
        });
    }
}
exports.AppDatabase = AppDatabase;
exports.db = new AppDatabase();
//# sourceMappingURL=app.database.js.map