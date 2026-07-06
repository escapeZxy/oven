"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workout_plans_service_1 = require("./workout-plans.service");
function createService() {
    const prisma = {
        workoutPlan: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
        },
    };
    return {
        prisma,
        service: new workout_plans_service_1.WorkoutPlansService(prisma),
    };
}
describe('WorkoutPlansService incremental sync', () => {
    it('supports updatedAt cursor based workout-plan sync', async () => {
        const { prisma, service } = createService();
        prisma.workoutPlan.findMany.mockResolvedValue([
            {
                id: 'plan-2',
                name: 'Plan 2',
                description: 'Synced plan',
                createdAt: new Date('2026-06-28T08:00:00.000Z'),
                updatedAt: new Date('2026-06-29T09:00:00.000Z'),
                schedule: null,
                trainingDays: [],
            },
        ]);
        const result = await service.getAll({
            updatedAfter: '2026-06-29T00:00:00.000Z',
            limit: 20,
        });
        expect(prisma.workoutPlan.findMany).toHaveBeenCalledWith({
            where: {
                updatedAt: {
                    gte: new Date('2026-06-29T00:00:00.000Z'),
                },
            },
            orderBy: [{ updatedAt: 'asc' }, { id: 'asc' }],
            take: 20,
        });
        expect(result[0]).toEqual(expect.objectContaining({
            id: 'plan-2',
            createdAt: '2026-06-28T08:00:00.000Z',
            updatedAt: '2026-06-29T09:00:00.000Z',
        }));
    });
    it('normalizes missing schedule ids when reading legacy plans', async () => {
        var _a, _b;
        const { prisma, service } = createService();
        prisma.workoutPlan.findMany.mockResolvedValue([
            {
                id: 'plan-legacy',
                name: 'Legacy Plan',
                description: 'Missing nested ids',
                createdAt: new Date('2026-06-28T08:00:00.000Z'),
                updatedAt: new Date('2026-06-29T09:00:00.000Z'),
                schedule: [
                    {
                        type: 'day',
                        name: 'Day 1',
                        exercises: [
                            {
                                name: 'Bench Press',
                                sets: 3,
                                reps: 10,
                            },
                        ],
                    },
                ],
                trainingDays: null,
            },
        ]);
        const [plan] = await service.getAll();
        expect((_a = plan.schedule) === null || _a === void 0 ? void 0 : _a[0]).toEqual(expect.objectContaining({
            id: 'plan-legacy:day:schedule.0',
        }));
        expect((_b = plan.schedule) === null || _b === void 0 ? void 0 : _b[0].exercises[0]).toEqual(expect.objectContaining({
            id: 'plan-legacy:day:schedule.0:exercise:0',
        }));
    });
    it('persists normalized ids when creating a new plan', async () => {
        var _a;
        const { prisma, service } = createService();
        prisma.workoutPlan.create.mockImplementation(async ({ data }) => {
            var _a;
            return ({
                id: 'plan-created',
                name: data.name,
                description: data.description,
                createdAt: new Date('2026-06-28T08:00:00.000Z'),
                updatedAt: new Date('2026-06-29T09:00:00.000Z'),
                schedule: data.schedule,
                trainingDays: (_a = data.trainingDays) !== null && _a !== void 0 ? _a : null,
            });
        });
        const result = await service.create({
            name: 'New Plan',
            description: 'Created from form',
            schedule: [
                {
                    type: 'day',
                    name: 'Day 1',
                    exercises: [
                        {
                            name: 'Squat',
                            sets: 3,
                            reps: 5,
                        },
                    ],
                },
            ],
        });
        const createCall = prisma.workoutPlan.create.mock.calls[0][0];
        const persistedSchedule = createCall.data.schedule;
        expect(persistedSchedule[0].id).toEqual(expect.stringMatching(/:day:schedule\.0$/));
        expect(persistedSchedule[0].exercises[0].id).toEqual(expect.stringMatching(/:exercise:0$/));
        expect((_a = result.schedule) === null || _a === void 0 ? void 0 : _a[0]).toEqual(expect.objectContaining({
            id: persistedSchedule[0].id,
        }));
    });
});
//# sourceMappingURL=workout-plans.service.test.js.map