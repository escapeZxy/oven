"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOCK_USER_WORKOUT_PLANS = void 0;
exports.seedDatabase = seedDatabase;
const app_database_1 = require("./app.database");
exports.MOCK_USER_WORKOUT_PLANS = [
    {
        id: 'user-plan-1',
        userId: 'user-1',
        workoutPlanId: 'plan-1',
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        currentDayIndex: 3,
        isActive: true,
        status: 'active',
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
        currentDayIndex: 15,
        isActive: false,
        status: 'interrupted',
        logHistory: [],
    },
    {
        id: 'user-plan-3',
        userId: 'user-1',
        workoutPlanId: 'plan-1',
        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        currentDayIndex: 48,
        isActive: false,
        status: 'completed',
        logHistory: [],
    },
];
async function seedDatabase() {
    const count = await app_database_1.db.userWorkoutPlans.count();
    if (count === 0) {
        console.log('Seeding database with mock data...');
        await app_database_1.db.userWorkoutPlans.bulkAdd(exports.MOCK_USER_WORKOUT_PLANS);
        console.log('Database seeded!');
    }
}
//# sourceMappingURL=seeder.js.map