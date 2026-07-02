import { v4 as uuidv4 } from 'uuid';
import { UserWorkoutPlan } from '../models';

const MOCK_USER_WORKOUT_PLANS: UserWorkoutPlan[] = [
  {
    id: 'user-plan-1',
    userId: 'user-1',
    workoutPlanId: 'plan-1',
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Started 10 days ago
    currentDayIndex: 4,
    isActive: true,
    status: 'active',
    isArchived: false,
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
    currentDayIndex: 48, // Completed
    isActive: false,
    status: 'completed',
    isArchived: false,
    logHistory: [],
  },
];

export interface IUserWorkoutPlanRepository {
  create(planData: Omit<UserWorkoutPlan, 'id'>): Promise<UserWorkoutPlan>;
  findById(id: string): Promise<UserWorkoutPlan | null>;
  findByUserId(userId: string): Promise<UserWorkoutPlan[]>;
  findActiveByUserId(userId: string): Promise<UserWorkoutPlan | null>;
  update(plan: UserWorkoutPlan): Promise<UserWorkoutPlan | null>;
  delete(id: string): Promise<boolean>;
  deactivateAllUserPlans(userId: string): Promise<void>;
}

export class InMemoryUserWorkoutPlanRepository implements IUserWorkoutPlanRepository {
  private userPlans: UserWorkoutPlan[] = MOCK_USER_WORKOUT_PLANS;

  public async create(planData: Omit<UserWorkoutPlan, 'id'>): Promise<UserWorkoutPlan> {
    const newPlan: UserWorkoutPlan = {
      id: uuidv4(),
      ...planData,
    };
    this.userPlans.push(newPlan);
    return newPlan;
  }

  public async findById(id: string): Promise<UserWorkoutPlan | null> {
    return this.userPlans.find(plan => plan.id === id) || null;
  }

  public async findByUserId(userId: string): Promise<UserWorkoutPlan[]> {
    return this.userPlans.filter(plan => plan.userId === userId);
  }

  public async findActiveByUserId(userId: string): Promise<UserWorkoutPlan | null> {
    return this.userPlans.find(plan => plan.userId === userId && plan.isActive) || null;
  }

  public async update(plan: UserWorkoutPlan): Promise<UserWorkoutPlan | null> {
    const existingIndex = this.userPlans.findIndex(p => p.id === plan.id);
    if (existingIndex === -1) {
      return null;
    }

    this.userPlans = [
      ...this.userPlans.slice(0, existingIndex),
      plan,
      ...this.userPlans.slice(existingIndex + 1)
    ];
    return plan;
  }

  public async delete(id: string): Promise<boolean> {
    const initialLength = this.userPlans.length;
    this.userPlans = this.userPlans.filter(plan => plan.id !== id);
    return this.userPlans.length < initialLength;
  }

  public async deactivateAllUserPlans(userId: string): Promise<void> {
    this.userPlans = this.userPlans.map(plan =>
      plan.userId === userId ? { ...plan, isActive: false } : plan
    );
  }
}
