import { UserWorkoutPlan } from '../models';
import { IUserWorkoutPlanRepository } from '../repositories/user-workout-plan.repository';
export declare class DexieUserWorkoutPlanRepository implements IUserWorkoutPlanRepository {
    create(planData: Omit<UserWorkoutPlan, 'id'>): Promise<UserWorkoutPlan>;
    findById(id: string): Promise<UserWorkoutPlan | null>;
    findByUserId(userId: string): Promise<UserWorkoutPlan[]>;
    findActiveByUserId(userId: string): Promise<UserWorkoutPlan | null>;
    update(plan: UserWorkoutPlan): Promise<UserWorkoutPlan | null>;
    delete(id: string): Promise<boolean>;
    deactivateAllUserPlans(userId: string): Promise<void>;
}
