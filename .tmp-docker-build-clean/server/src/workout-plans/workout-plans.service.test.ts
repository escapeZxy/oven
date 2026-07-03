import { PrismaService } from '../prisma/prisma.service';
import { WorkoutPlansService } from './workout-plans.service';

function createService() {
  const prisma = {
    workoutPlan: {
      findMany: jest.fn(),
    },
  };

  return {
    prisma,
    service: new WorkoutPlansService(prisma as unknown as PrismaService),
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
    expect(result[0]).toEqual(
      expect.objectContaining({
        id: 'plan-2',
        createdAt: '2026-06-28T08:00:00.000Z',
        updatedAt: '2026-06-29T09:00:00.000Z',
      }),
    );
  });
});
