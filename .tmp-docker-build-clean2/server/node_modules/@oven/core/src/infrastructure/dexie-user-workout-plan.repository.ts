import { v4 as uuidv4 } from 'uuid';
import { UserWorkoutPlan } from '../models';
import { IUserWorkoutPlanRepository } from '../repositories/user-workout-plan.repository';
import { db } from './app.database';

export class DexieUserWorkoutPlanRepository implements IUserWorkoutPlanRepository {
  async create(planData: Omit<UserWorkoutPlan, 'id'>): Promise<UserWorkoutPlan> {
    const newPlan: UserWorkoutPlan = {
      id: uuidv4(),
      ...planData,
    };
    await db.userWorkoutPlans.add(newPlan);
    return newPlan;
  }

  async findById(id: string): Promise<UserWorkoutPlan | null> {
    const plan = await db.userWorkoutPlans.get(id);
    return plan || null;
  }

  async findByUserId(userId: string): Promise<UserWorkoutPlan[]> {
    return await db.userWorkoutPlans
      .where('userId')
      .equals(userId)
      .toArray();
  }

  async findActiveByUserId(userId: string): Promise<UserWorkoutPlan | null> {
    // Dexie doesn't support multi-field index queries directly without compound index.
    // However, since a user won't have thousands of plans, filtering in memory after userId index fetch is fine.
    // Or we can use filter() on Collection.
    const plans = await db.userWorkoutPlans
      .where('userId')
      .equals(userId)
      .filter(plan => plan.isActive)
      .toArray();

    return plans.length > 0 ? plans[0] : null;
  }

  async update(plan: UserWorkoutPlan): Promise<UserWorkoutPlan | null> {
    // We use put() instead of update() because we are replacing the entire object.
    // Also, update() type definition forbids passing the primary key in the changes object,
    // which causes type errors since UserWorkoutPlan includes 'id'.
    // put() handles "insert or update" semantics perfectly here.
    await db.userWorkoutPlans.put(plan);
    return plan;
  }

  async delete(id: string): Promise<boolean> {
    await db.userWorkoutPlans.delete(id);
    // Dexie delete returns void, so we assume success if no error thrown
    return true;
  }

  async deactivateAllUserPlans(userId: string): Promise<void> {
    // Find all active plans for user and update them
    // This uses a transaction implicitly if we wanted atomic, but here separate ops is okay
    const activePlans = await db.userWorkoutPlans
      .where('userId')
      .equals(userId)
      .filter(plan => plan.isActive)
      .toArray();

    const updates = activePlans.map(plan =>
      db.userWorkoutPlans.update(plan.id, { isActive: false })
    );

    await Promise.all(updates);
  }
}
