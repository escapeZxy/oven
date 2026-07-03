"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DexieWorkoutLogRepository = void 0;
const app_database_1 = require("./app.database");
class DexieWorkoutLogRepository {
    async create(log) {
        await app_database_1.db.workoutLogs.add(log);
    }
    async getLastLog(userId, exerciseId) {
        const logs = await app_database_1.db.workoutLogs
            .where('completedExercises.exerciseId')
            .equals(exerciseId)
            .reverse()
            .sortBy('date');
        if (logs.length > 0) {
            const log = logs.find(l => l.userId === userId);
            return log || null;
        }
        return null;
    }
    async findAllByUserId(userId) {
        return await app_database_1.db.workoutLogs
            .where('userId')
            .equals(userId)
            .reverse()
            .sortBy('date');
    }
}
exports.DexieWorkoutLogRepository = DexieWorkoutLogRepository;
//# sourceMappingURL=dexie-workout-log.repository.js.map