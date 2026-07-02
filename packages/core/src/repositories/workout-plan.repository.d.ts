import { WorkoutPlan } from '../models';
export declare class WorkoutPlanRepository {
    private plans;
    create(planData: Omit<WorkoutPlan, 'id'>): Promise<WorkoutPlan>;
    findById(id: string): Promise<WorkoutPlan | null>;
    findAll(): Promise<WorkoutPlan[]>;
    update(plan: WorkoutPlan): Promise<WorkoutPlan | null>;
    delete(id: string): Promise<boolean>;
}
