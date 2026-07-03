import { UserWorkoutPlan, CompletedExerciseLog } from '../models';
import { UserWorkoutPlanRepository } from '../repositories/user-workout-plan.repository';
import { WorkoutPlanRepository } from '../repositories/workout-plan.repository';
export declare class WorkoutService {
    private userWorkoutPlanRepository;
    private workoutPlanRepository;
    constructor(userWorkoutPlanRepository: UserWorkoutPlanRepository, workoutPlanRepository: WorkoutPlanRepository);
    startPlan(userId: string, workoutPlanId: string): Promise<UserWorkoutPlan>;
    logWorkout(userWorkoutPlanId: string, completedExercises: CompletedExerciseLog[]): Promise<UserWorkoutPlan>;
    skipDay(userWorkoutPlanId: string): Promise<UserWorkoutPlan>;
    getActivePlan(userId: string): Promise<UserWorkoutPlan | null>;
    getAllPlans(userId: string): Promise<UserWorkoutPlan[]>;
    private _updatePlanWithNewLog;
}
//# sourceMappingURL=workout.service.d.ts.map