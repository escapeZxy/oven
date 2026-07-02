"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const client_1 = require("../generated/prisma/client");
const workout_logs_service_1 = require("./workout-logs.service");
function createService() {
    const prisma = {
        workoutLog: {
            findMany: jest.fn(),
        },
    };
    return {
        prisma,
        service: new workout_logs_service_1.WorkoutLogsService(prisma),
    };
}
describe('WorkoutLogsService create boundary', () => {
    it('rejects detached formal log creation outside the atomic user-plan commit API', async () => {
        const service = new workout_logs_service_1.WorkoutLogsService({});
        await expect(service.create('user-1', {
            userPlanId: 'up-1',
            workoutPlanId: 'plan-1',
            trainingDayId: 'day-1',
            status: client_1.WorkoutLogStatus.completed,
            completedExercises: [],
        })).rejects.toThrow(common_1.ConflictException);
    });
});
describe('WorkoutLogsService incremental sync', () => {
    it('supports updatedAt cursor based workout-log sync', async () => {
        const { prisma, service } = createService();
        prisma.workoutLog.findMany.mockResolvedValue([
            {
                id: 'log-2',
                userId: 'user-1',
                workoutPlanId: 'plan-1',
                trainingDayId: 'day-2',
                createdAt: new Date('2026-06-29T08:00:00.000Z'),
                updatedAt: new Date('2026-06-29T09:00:00.000Z'),
                date: new Date('2026-06-29T08:00:00.000Z'),
                status: client_1.WorkoutLogStatus.completed,
                completedExercises: [],
            },
        ]);
        const logs = await service.getByUserId('user-1', {
            updatedAfter: '2026-06-29T00:00:00.000Z',
            limit: 20,
        });
        expect(prisma.workoutLog.findMany).toHaveBeenCalledWith({
            where: {
                userId: 'user-1',
                updatedAt: {
                    gte: new Date('2026-06-29T00:00:00.000Z'),
                },
            },
            orderBy: [{ updatedAt: 'asc' }, { id: 'asc' }],
            take: 20,
        });
        expect(logs[0]).toEqual(expect.objectContaining({
            id: 'log-2',
            createdAt: '2026-06-29T08:00:00.000Z',
            updatedAt: '2026-06-29T09:00:00.000Z',
        }));
    });
});
describe('WorkoutLogsService volume aggregation', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    it('aggregates weekly volume into fixed buckets and fills empty weeks with zero', async () => {
        jest.setSystemTime(new Date('2026-06-24T12:00:00.000Z'));
        const { prisma, service } = createService();
        prisma.workoutLog.findMany.mockResolvedValue([
            {
                id: 'log-1',
                userId: 'user-1',
                workoutPlanId: 'plan-1',
                trainingDayId: 'day-1',
                date: new Date('2026-06-10T08:00:00.000Z'),
                status: client_1.WorkoutLogStatus.completed,
                completedExercises: [
                    {
                        exerciseId: 'squat',
                        sets: 1,
                        reps: [5],
                        weight: [20],
                    },
                ],
            },
            {
                id: 'log-2',
                userId: 'user-1',
                workoutPlanId: 'plan-1',
                trainingDayId: 'day-2',
                date: new Date('2026-06-23T08:00:00.000Z'),
                status: client_1.WorkoutLogStatus.completed,
                completedExercises: [
                    {
                        exerciseId: 'bench',
                        sets: 2,
                        reps: [5, 5],
                        weight: [10, 10],
                    },
                ],
            },
        ]);
        const summary = await service.getVolumeSummary('user-1', {
            bucket: 'week',
            limit: 3,
        });
        expect(summary.bucket).toBe('week');
        expect(summary.points).toEqual([
            expect.objectContaining({
                bucketStart: '2026-06-08T00:00:00.000Z',
                volume: 100,
                completedLogCount: 1,
            }),
            expect.objectContaining({
                bucketStart: '2026-06-15T00:00:00.000Z',
                volume: 0,
                completedLogCount: 0,
            }),
            expect.objectContaining({
                bucketStart: '2026-06-22T00:00:00.000Z',
                volume: 100,
                completedLogCount: 1,
            }),
        ]);
    });
    it('aggregates monthly volume into fixed buckets', async () => {
        jest.setSystemTime(new Date('2026-06-24T12:00:00.000Z'));
        const { prisma, service } = createService();
        prisma.workoutLog.findMany.mockResolvedValue([
            {
                id: 'log-1',
                userId: 'user-1',
                workoutPlanId: 'plan-1',
                trainingDayId: 'day-1',
                date: new Date('2026-05-10T08:00:00.000Z'),
                status: client_1.WorkoutLogStatus.completed,
                completedExercises: [
                    {
                        exerciseId: 'row',
                        sets: 1,
                        reps: [8],
                        weight: [15],
                    },
                ],
            },
            {
                id: 'log-2',
                userId: 'user-1',
                workoutPlanId: 'plan-1',
                trainingDayId: 'day-2',
                date: new Date('2026-06-20T08:00:00.000Z'),
                status: client_1.WorkoutLogStatus.completed,
                completedExercises: [
                    {
                        exerciseId: 'deadlift',
                        sets: 1,
                        reps: [3],
                        weight: [60],
                    },
                ],
            },
        ]);
        const summary = await service.getVolumeSummary('user-1', {
            bucket: 'month',
            limit: 2,
        });
        expect(summary.bucket).toBe('month');
        expect(summary.points).toEqual([
            expect.objectContaining({
                bucketStart: '2026-05-01T00:00:00.000Z',
                volume: 120,
                completedLogCount: 1,
            }),
            expect.objectContaining({
                bucketStart: '2026-06-01T00:00:00.000Z',
                volume: 180,
                completedLogCount: 1,
            }),
        ]);
    });
});
describe('WorkoutLogsService exercise trends', () => {
    it('builds recent exercise trends from completed logs and sorts by latest activity', async () => {
        var _a;
        const { prisma, service } = createService();
        prisma.workoutLog.findMany.mockResolvedValue([
            {
                id: 'log-4',
                userId: 'user-1',
                workoutPlanId: 'plan-1',
                trainingDayId: 'day-4',
                date: new Date('2026-06-24T08:00:00.000Z'),
                status: client_1.WorkoutLogStatus.completed,
                completedExercises: [
                    {
                        exerciseId: 'bench-press',
                        sets: 1,
                        reps: [5],
                        weight: [50],
                    },
                ],
            },
            {
                id: 'log-3',
                userId: 'user-1',
                workoutPlanId: 'plan-1',
                trainingDayId: 'day-3',
                date: new Date('2026-06-22T08:00:00.000Z'),
                status: client_1.WorkoutLogStatus.completed,
                completedExercises: [
                    {
                        exerciseId: 'squat',
                        sets: 1,
                        reps: [5],
                        weight: [110],
                    },
                ],
            },
            {
                id: 'log-2',
                userId: 'user-1',
                workoutPlanId: 'plan-1',
                trainingDayId: 'day-2',
                date: new Date('2026-06-15T08:00:00.000Z'),
                status: client_1.WorkoutLogStatus.completed,
                completedExercises: [
                    {
                        exerciseId: 'squat',
                        sets: 1,
                        reps: [5],
                        weight: [100],
                    },
                ],
            },
            {
                id: 'log-1',
                userId: 'user-1',
                workoutPlanId: 'plan-1',
                trainingDayId: 'day-1',
                date: new Date('2026-06-08T08:00:00.000Z'),
                status: client_1.WorkoutLogStatus.completed,
                completedExercises: [
                    {
                        exerciseId: 'squat',
                        sets: 1,
                        reps: [5],
                        weight: [90],
                    },
                    {
                        exerciseId: 'barbell-row',
                        sets: 1,
                        reps: [8],
                        weight: [40],
                    },
                ],
            },
        ]);
        const summary = await service.getExerciseTrendSummary('user-1', { limit: 3 });
        expect(summary.items).toEqual([
            expect.objectContaining({
                exerciseId: 'bench-press',
                latestVolume: 250,
                previousVolume: null,
                changeVolume: null,
                changeRate: null,
                direction: 'new',
                sessionCount: 1,
            }),
            expect.objectContaining({
                exerciseId: 'squat',
                latestVolume: 550,
                previousVolume: 500,
                changeVolume: 50,
                changeRate: 10,
                direction: 'up',
                sessionCount: 3,
            }),
            expect.objectContaining({
                exerciseId: 'barbell-row',
                latestVolume: 320,
                previousVolume: null,
                changeVolume: null,
                changeRate: null,
                direction: 'new',
                sessionCount: 1,
            }),
        ]);
        expect((_a = summary.items[1]) === null || _a === void 0 ? void 0 : _a.points).toEqual([
            {
                loggedAt: '2026-06-08T08:00:00.000Z',
                volume: 450,
            },
            {
                loggedAt: '2026-06-15T08:00:00.000Z',
                volume: 500,
            },
            {
                loggedAt: '2026-06-22T08:00:00.000Z',
                volume: 550,
            },
        ]);
    });
});
//# sourceMappingURL=workout-logs.service.test.js.map