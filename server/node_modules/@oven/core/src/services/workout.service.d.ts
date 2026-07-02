import { UserWorkoutPlan, WorkoutPlan, CompletedExerciseLog, WorkoutLog, TrainingDay } from '../models';
import { IUserWorkoutPlanRepository } from '../repositories/user-workout-plan.repository';
import { WorkoutPlanRepository } from '../repositories/workout-plan.repository';
import { IWorkoutLogRepository } from '../repositories/workout-log.repository';
export declare class WorkoutService {
    private userWorkoutPlanRepository;
    private workoutPlanRepository;
    private workoutLogRepository;
    constructor(userWorkoutPlanRepository: IUserWorkoutPlanRepository, workoutPlanRepository: WorkoutPlanRepository, workoutLogRepository: IWorkoutLogRepository);
    getLastExerciseLog(userId: string, exerciseId: string): Promise<WorkoutLog | null>;
    getAllLogs(userId: string): Promise<WorkoutLog[]>;
    startPlan(userId: string, workoutPlanId: string): Promise<UserWorkoutPlan>;
    resumePlan(userId: string, userPlanId: string): Promise<UserWorkoutPlan>;
    archivePlan(userPlanId: string): Promise<UserWorkoutPlan>;
    private deactivateAllUserPlans;
    logWorkout(userWorkoutPlanId: string, completedExercises: CompletedExerciseLog[]): Promise<UserWorkoutPlan>;
    skipDay(userWorkoutPlanId: string): Promise<UserWorkoutPlan>;
    getActivePlan(userId: string): Promise<UserWorkoutPlan | null>;
    getAllPlans(userId: string): Promise<UserWorkoutPlan[]>;
    getPlanDefinitions(): Promise<WorkoutPlan[]>;
    createPlanDefinition(planData: Omit<WorkoutPlan, 'id'>): Promise<WorkoutPlan>;
    flattenPlan(plan: WorkoutPlan): TrainingDay[];
    private _flattenScheduleItems;
    private _updatePlanWithNewLog;
}
