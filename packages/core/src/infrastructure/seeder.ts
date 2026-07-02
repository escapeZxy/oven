import { UserWorkoutPlan } from '../models';
import { db } from './app.database';
import { v4 as uuidv4 } from 'uuid';

export const MOCK_USER_WORKOUT_PLANS: UserWorkoutPlan[] = [
  {
    id: 'user-plan-1',
    userId: 'user-1',
    workoutPlanId: 'plan-1',
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Started 10 days ago
    currentDayIndex: 3,
    isActive: true,
    status: 'active',
    logHistory: [
      // Mock some history
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
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Started 30 days ago
    currentDayIndex: 15, // Some progress
    isActive: false, // Inactive
    status: 'interrupted',
    logHistory: [],
  },
  {
    id: 'user-plan-3',
    userId: 'user-1',
    workoutPlanId: 'plan-1',
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // Started 60 days ago
    currentDayIndex: 48, // Completed
    isActive: false,
    status: 'completed',
    logHistory: [],
  },
];

export async function seedDatabase() {
  const count = await db.userWorkoutPlans.count();
  if (count === 0) {
    console.log('Seeding database with mock data...');
    await db.userWorkoutPlans.bulkAdd(MOCK_USER_WORKOUT_PLANS);
    console.log('Database seeded!');
  }
}
