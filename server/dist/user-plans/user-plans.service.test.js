"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const client_1 = require("../generated/prisma/client");
const user_plans_service_1 = require("./user-plans.service");
function createService() {
    const transactionClient = {
        workoutLog: {
            create: jest.fn().mockResolvedValue(undefined),
        },
        userWorkoutPlan: {
            updateMany: jest.fn().mockResolvedValue(undefined),
            update: jest.fn().mockResolvedValue(undefined),
        },
    };
    const prisma = {
        workoutLog: {
            findUnique: jest.fn(),
        },
        userWorkoutPlan: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn().mockResolvedValue(undefined),
        },
        workoutPlan: {
            findUnique: jest.fn(),
        },
        $transaction: jest.fn(async (callback) => callback(transactionClient)),
    };
    return {
        prisma,
        transactionClient,
        service: new user_plans_service_1.UserPlansService(prisma),
    };
}
describe('UserPlansService auth-aware boundaries', () => {
    it('supports incremental user-plan sync by updatedAt cursor', async () => {
        const { prisma, service } = createService();
        prisma.userWorkoutPlan.findMany.mockResolvedValue([
            {
                id: 'up-2',
                userId: 'user-1',
                workoutPlanId: 'plan-1',
                createdAt: new Date('2026-06-28T08:00:00.000Z'),
                updatedAt: new Date('2026-06-29T08:00:00.000Z'),
                startDate: new Date('2026-06-28T08:00:00.000Z'),
                currentDayIndex: 1,
                status: client_1.UserWorkoutPlanStatus.active,
                isArchived: false,
                isActive: true,
                logs: [],
            },
        ]);
        const result = await service.getByUserId('user-1', {
            updatedAfter: '2026-06-28T00:00:00.000Z',
            limit: 50,
        });
        expect(prisma.userWorkoutPlan.findMany).toHaveBeenCalledWith({
            where: {
                userId: 'user-1',
                updatedAt: {
                    gte: new Date('2026-06-28T00:00:00.000Z'),
                },
            },
            include: {
                logs: {
                    orderBy: {
                        date: 'desc',
                    },
                },
            },
            orderBy: [{ updatedAt: 'asc' }, { id: 'asc' }],
            take: 50,
        });
        expect(result[0]).toEqual(expect.objectContaining({
            id: 'up-2',
            createdAt: '2026-06-28T08:00:00.000Z',
            updatedAt: '2026-06-29T08:00:00.000Z',
        }));
    });
    it('aggregates completion rate from closed user plans without counting active plans as failures', async () => {
        const { prisma, service } = createService();
        prisma.userWorkoutPlan.findMany.mockResolvedValue([
            { status: client_1.UserWorkoutPlanStatus.completed },
            { status: client_1.UserWorkoutPlanStatus.completed },
            { status: client_1.UserWorkoutPlanStatus.interrupted },
            { status: client_1.UserWorkoutPlanStatus.active },
        ]);
        const result = await service.getCompletionRateSummary('user-1');
        expect(prisma.userWorkoutPlan.findMany).toHaveBeenCalledWith({
            where: {
                userId: 'user-1',
                isArchived: false,
            },
            select: {
                status: true,
            },
        });
        expect(result).toEqual({
            completionRate: (2 / 3) * 100,
            completedPlanCount: 2,
            interruptedPlanCount: 1,
            activePlanCount: 1,
            closedPlanCount: 3,
        });
    });
    it('rejects reading a user plan that does not belong to the authenticated user', async () => {
        const { prisma, service } = createService();
        prisma.userWorkoutPlan.findFirst.mockResolvedValue(null);
        await expect(service.getById('up-1', 'user-2')).rejects.toThrow('User workout plan "up-1" not found.');
    });
    it('rejects mismatched trainingDayId against the authoritative current day', async () => {
        const { prisma, service } = createService();
        prisma.userWorkoutPlan.findFirst.mockResolvedValue({
            id: 'up-1',
            userId: 'user-1',
            workoutPlanId: 'plan-1',
            currentDayIndex: 0,
            status: client_1.UserWorkoutPlanStatus.active,
            isActive: true,
            isArchived: false,
        });
        prisma.workoutPlan.findUnique.mockResolvedValue({
            id: 'plan-1',
            schedule: [{ id: 'day-1', type: 'training', name: 'Day 1', exercises: [] }],
            trainingDays: null,
        });
        await expect(service.appendLog('up-1', {
            clientRequestId: 'req-1',
            workoutPlanId: 'plan-1',
            trainingDayId: 'wrong-day',
            expectedCurrentDayIndex: 0,
            nextDayIndex: 1,
            userPlanStatus: client_1.UserWorkoutPlanStatus.completed,
            isActive: false,
            logStatus: client_1.WorkoutLogStatus.completed,
            completedExercises: [],
        }, 'user-1')).rejects.toBeInstanceOf(common_1.ConflictException);
        await service.appendLog('up-1', {
            clientRequestId: 'req-1',
            workoutPlanId: 'plan-1',
            trainingDayId: 'wrong-day',
            expectedCurrentDayIndex: 0,
            nextDayIndex: 1,
            userPlanStatus: client_1.UserWorkoutPlanStatus.completed,
            isActive: false,
            logStatus: client_1.WorkoutLogStatus.completed,
            completedExercises: [],
        }, 'user-1').catch((error) => {
            expect(error.getResponse()).toEqual({
                code: 'training_day_mismatch',
                message: 'User workout plan "up-1" expects trainingDayId "day-1" at day index 0.',
                recoveryAction: 'refresh_session',
                details: {
                    expectedTrainingDayId: 'day-1',
                    submittedTrainingDayId: 'wrong-day',
                    currentDayIndex: 0,
                },
            });
        });
        expect(prisma.$transaction).not.toHaveBeenCalled();
    });
    it('classifies stale currentDayIndex as a refreshable conflict', async () => {
        const { prisma, service } = createService();
        prisma.userWorkoutPlan.findFirst.mockResolvedValue({
            id: 'up-1',
            userId: 'user-1',
            workoutPlanId: 'plan-1',
            currentDayIndex: 2,
            status: client_1.UserWorkoutPlanStatus.active,
            isActive: true,
            isArchived: false,
        });
        await service.appendLog('up-1', {
            clientRequestId: 'req-stale-day',
            workoutPlanId: 'plan-1',
            trainingDayId: 'day-2',
            expectedCurrentDayIndex: 1,
            nextDayIndex: 2,
            userPlanStatus: client_1.UserWorkoutPlanStatus.active,
            isActive: true,
            logStatus: client_1.WorkoutLogStatus.completed,
            completedExercises: [],
        }, 'user-1').catch((error) => {
            expect(error.getResponse()).toEqual({
                code: 'user_plan_day_advanced',
                message: 'User workout plan "up-1" is already at day index 2.',
                recoveryAction: 'refresh_session',
                details: {
                    serverCurrentDayIndex: 2,
                    submittedExpectedDayIndex: 1,
                },
            });
        });
    });
    it('accepts a valid non-final commit and persists the authenticated user id', async () => {
        const { prisma, transactionClient, service } = createService();
        prisma.userWorkoutPlan.findFirst
            .mockResolvedValueOnce({
            id: 'up-1',
            userId: 'user-1',
            workoutPlanId: 'plan-1',
            currentDayIndex: 0,
            status: client_1.UserWorkoutPlanStatus.active,
            isActive: true,
            isArchived: false,
        })
            .mockResolvedValueOnce({
            id: 'up-1',
            userId: 'user-1',
            workoutPlanId: 'plan-1',
            startDate: new Date('2026-06-26T00:00:00.000Z'),
            currentDayIndex: 1,
            status: client_1.UserWorkoutPlanStatus.active,
            isArchived: false,
            isActive: true,
            logs: [
                {
                    id: 'log-1',
                    userId: 'user-1',
                    workoutPlanId: 'plan-1',
                    trainingDayId: 'day-1',
                    date: new Date('2026-06-26T08:00:00.000Z'),
                    status: client_1.WorkoutLogStatus.completed,
                    completedExercises: [],
                },
            ],
        });
        prisma.workoutPlan.findUnique.mockResolvedValue({
            id: 'plan-1',
            schedule: [
                { id: 'day-1', type: 'training', name: 'Day 1', exercises: [] },
                { id: 'day-2', type: 'training', name: 'Day 2', exercises: [] },
            ],
            trainingDays: null,
        });
        const result = await service.appendLog('up-1', {
            clientRequestId: 'req-2',
            workoutPlanId: 'plan-1',
            trainingDayId: 'day-1',
            expectedCurrentDayIndex: 0,
            nextDayIndex: 1,
            userPlanStatus: client_1.UserWorkoutPlanStatus.active,
            isActive: true,
            logStatus: client_1.WorkoutLogStatus.completed,
            completedExercises: [
                {
                    exerciseId: 'squat',
                    sets: 1,
                    reps: [5],
                    weight: [100],
                },
            ],
        }, 'user-1');
        expect(prisma.$transaction).toHaveBeenCalledTimes(1);
        expect(transactionClient.workoutLog.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                clientRequestId: 'req-2',
                userPlanId: 'up-1',
                userId: 'user-1',
                trainingDayId: 'day-1',
                status: client_1.WorkoutLogStatus.completed,
            }),
        }));
        expect(result.currentDayIndex).toBe(1);
        expect(result.status).toBe(client_1.UserWorkoutPlanStatus.active);
    });
    it('allows completing a rest day without exercise payload', async () => {
        const { prisma, transactionClient, service } = createService();
        prisma.userWorkoutPlan.findFirst
            .mockResolvedValueOnce({
            id: 'up-rest',
            userId: 'user-1',
            workoutPlanId: 'plan-rest',
            currentDayIndex: 0,
            status: client_1.UserWorkoutPlanStatus.active,
            isActive: true,
            isArchived: false,
        })
            .mockResolvedValueOnce({
            id: 'up-rest',
            userId: 'user-1',
            workoutPlanId: 'plan-rest',
            startDate: new Date('2026-06-26T00:00:00.000Z'),
            currentDayIndex: 1,
            status: client_1.UserWorkoutPlanStatus.completed,
            isArchived: false,
            isActive: false,
            logs: [
                {
                    id: 'log-rest',
                    userId: 'user-1',
                    workoutPlanId: 'plan-rest',
                    trainingDayId: 'rest-1',
                    date: new Date('2026-06-26T08:00:00.000Z'),
                    status: client_1.WorkoutLogStatus.completed,
                    completedExercises: [],
                },
            ],
        });
        prisma.workoutPlan.findUnique.mockResolvedValue({
            id: 'plan-rest',
            schedule: [{ id: 'rest-1', type: 'rest', name: 'Rest Day', exercises: [] }],
            trainingDays: null,
        });
        const result = await service.appendLog('up-rest', {
            clientRequestId: 'req-rest',
            workoutPlanId: 'plan-rest',
            trainingDayId: 'rest-1',
            expectedCurrentDayIndex: 0,
            nextDayIndex: 1,
            userPlanStatus: client_1.UserWorkoutPlanStatus.completed,
            isActive: false,
            logStatus: client_1.WorkoutLogStatus.completed,
            completedExercises: [],
        }, 'user-1');
        expect(transactionClient.workoutLog.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                trainingDayId: 'rest-1',
                status: client_1.WorkoutLogStatus.completed,
                completedExercises: [],
            }),
        }));
        expect(result.status).toBe(client_1.UserWorkoutPlanStatus.completed);
    });
    it('returns the existing user plan when the same clientRequestId is replayed', async () => {
        const { prisma, service } = createService();
        prisma.workoutLog.findUnique.mockResolvedValue({
            id: 'log-1',
            clientRequestId: 'req-replay',
            userPlanId: 'up-1',
            userId: 'user-1',
            workoutPlanId: 'plan-1',
            trainingDayId: 'day-1',
            status: client_1.WorkoutLogStatus.completed,
            completedExercises: [
                {
                    exerciseId: 'squat',
                    sets: 1,
                    reps: [5],
                    weight: [100],
                },
            ],
        });
        prisma.userWorkoutPlan.findFirst.mockResolvedValue({
            id: 'up-1',
            userId: 'user-1',
            workoutPlanId: 'plan-1',
            startDate: new Date('2026-06-26T00:00:00.000Z'),
            currentDayIndex: 1,
            status: client_1.UserWorkoutPlanStatus.active,
            isArchived: false,
            isActive: true,
            logs: [],
        });
        const result = await service.appendLog('up-1', {
            clientRequestId: 'req-replay',
            workoutPlanId: 'plan-1',
            trainingDayId: 'day-1',
            expectedCurrentDayIndex: 0,
            nextDayIndex: 1,
            userPlanStatus: client_1.UserWorkoutPlanStatus.active,
            isActive: true,
            logStatus: client_1.WorkoutLogStatus.completed,
            completedExercises: [
                {
                    exerciseId: 'squat',
                    sets: 1,
                    reps: [5],
                    weight: [100],
                },
            ],
        }, 'user-1');
        expect(prisma.$transaction).not.toHaveBeenCalled();
        expect(result.currentDayIndex).toBe(1);
    });
    it('rejects reusing a clientRequestId with a different workout payload', async () => {
        const { prisma, service } = createService();
        prisma.workoutLog.findUnique.mockResolvedValue({
            id: 'log-1',
            clientRequestId: 'req-replay',
            userPlanId: 'up-1',
            userId: 'user-1',
            workoutPlanId: 'plan-1',
            trainingDayId: 'day-1',
            status: client_1.WorkoutLogStatus.completed,
            completedExercises: [],
        });
        await service.appendLog('up-1', {
            clientRequestId: 'req-replay',
            workoutPlanId: 'plan-1',
            trainingDayId: 'day-1',
            expectedCurrentDayIndex: 0,
            nextDayIndex: 1,
            userPlanStatus: client_1.UserWorkoutPlanStatus.active,
            isActive: true,
            logStatus: client_1.WorkoutLogStatus.completed,
            completedExercises: [
                {
                    exerciseId: 'squat',
                    sets: 1,
                    reps: [5],
                    weight: [100],
                },
            ],
        }, 'user-1').catch((error) => {
            expect(error.getResponse()).toEqual({
                code: 'client_request_reused',
                message: 'clientRequestId "req-replay" is already bound to a different workout commit.',
                recoveryAction: 'return_dashboard',
            });
        });
    });
    it('treats a unique clientRequestId conflict during write as a successful concurrent replay', async () => {
        const { prisma, transactionClient, service } = createService();
        prisma.workoutLog.findUnique
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce({
            id: 'log-1',
            clientRequestId: 'req-concurrent',
            userPlanId: 'up-1',
            userId: 'user-1',
            workoutPlanId: 'plan-1',
            trainingDayId: 'day-1',
            status: client_1.WorkoutLogStatus.completed,
            completedExercises: [
                {
                    exerciseId: 'squat',
                    sets: 1,
                    reps: [5],
                    weight: [100],
                },
            ],
        });
        prisma.userWorkoutPlan.findFirst
            .mockResolvedValueOnce({
            id: 'up-1',
            userId: 'user-1',
            workoutPlanId: 'plan-1',
            currentDayIndex: 0,
            status: client_1.UserWorkoutPlanStatus.active,
            isActive: true,
            isArchived: false,
        })
            .mockResolvedValueOnce({
            id: 'up-1',
            userId: 'user-1',
            workoutPlanId: 'plan-1',
            startDate: new Date('2026-06-26T00:00:00.000Z'),
            currentDayIndex: 1,
            status: client_1.UserWorkoutPlanStatus.active,
            isArchived: false,
            isActive: true,
            logs: [],
        });
        prisma.workoutPlan.findUnique.mockResolvedValue({
            id: 'plan-1',
            schedule: [
                { id: 'day-1', type: 'training', name: 'Day 1', exercises: [] },
                { id: 'day-2', type: 'training', name: 'Day 2', exercises: [] },
            ],
            trainingDays: null,
        });
        prisma.$transaction.mockImplementationOnce(async () => {
            throw {
                code: 'P2002',
                meta: {
                    target: ['clientRequestId'],
                },
            };
        });
        const result = await service.appendLog('up-1', {
            clientRequestId: 'req-concurrent',
            workoutPlanId: 'plan-1',
            trainingDayId: 'day-1',
            expectedCurrentDayIndex: 0,
            nextDayIndex: 1,
            userPlanStatus: client_1.UserWorkoutPlanStatus.active,
            isActive: true,
            logStatus: client_1.WorkoutLogStatus.completed,
            completedExercises: [
                {
                    exerciseId: 'squat',
                    sets: 1,
                    reps: [5],
                    weight: [100],
                },
            ],
        }, 'user-1');
        expect(transactionClient.workoutLog.create).not.toHaveBeenCalled();
        expect(result.currentDayIndex).toBe(1);
    });
    it('resumes an interrupted plan only inside the authenticated user scope', async () => {
        const { prisma, service } = createService();
        prisma.userWorkoutPlan.findFirst
            .mockResolvedValueOnce({
            id: 'up-1',
            userId: 'user-1',
            workoutPlanId: 'plan-1',
            currentDayIndex: 2,
            status: client_1.UserWorkoutPlanStatus.interrupted,
            isActive: false,
            isArchived: false,
        })
            .mockResolvedValueOnce({
            id: 'up-1',
            userId: 'user-1',
            workoutPlanId: 'plan-1',
            startDate: new Date('2026-06-20T00:00:00.000Z'),
            currentDayIndex: 2,
            status: client_1.UserWorkoutPlanStatus.active,
            isArchived: false,
            isActive: true,
            logs: [],
        });
        const result = await service.resume('up-1', 'user-1');
        expect(prisma.$transaction).toHaveBeenCalledTimes(1);
        expect(result.status).toBe(client_1.UserWorkoutPlanStatus.active);
    });
    it('archives an inactive plan through the explicit action endpoint', async () => {
        const { prisma, service } = createService();
        prisma.userWorkoutPlan.findFirst
            .mockResolvedValueOnce({
            id: 'up-1',
            userId: 'user-1',
            workoutPlanId: 'plan-1',
            currentDayIndex: 2,
            status: client_1.UserWorkoutPlanStatus.interrupted,
            isActive: false,
            isArchived: false,
        })
            .mockResolvedValueOnce({
            id: 'up-1',
            userId: 'user-1',
            workoutPlanId: 'plan-1',
            startDate: new Date('2026-06-20T00:00:00.000Z'),
            currentDayIndex: 2,
            status: client_1.UserWorkoutPlanStatus.interrupted,
            isArchived: true,
            isActive: false,
            logs: [],
        });
        const result = await service.archive('up-1', 'user-1');
        expect(prisma.userWorkoutPlan.update).toHaveBeenCalledWith({
            where: { id: 'up-1' },
            data: {
                isArchived: true,
            },
        });
        expect(result.isArchived).toBe(true);
    });
});
//# sourceMappingURL=user-plans.service.test.js.map