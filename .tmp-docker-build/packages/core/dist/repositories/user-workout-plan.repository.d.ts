import { UserWorkoutPlan } from '../models';
export declare class UserWorkoutPlanRepository {
    private userPlans;
    create(planData: Omit<UserWorkoutPlan, 'id'>): Promise<UserWorkoutPlan>;
    findById(id: string): Promise<UserWorkoutPlan | null>;
    findByUserId(userId: string): Promise<UserWorkoutPlan[]>;
    findActiveByUserId(userId: string): Promise<UserWorkoutPlan | null>;
    update(plan: UserWorkoutPlan): Promise<UserWorkoutPlan | null>;
    delete(id: string): Promise<boolean>;
    deactivateAllUserPlans(userId: string): Promise<void>;
}
//# sourceMappingURL=user-workout-plan.repository.d.ts.map