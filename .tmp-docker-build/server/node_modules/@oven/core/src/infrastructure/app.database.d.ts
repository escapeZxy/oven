import Dexie, { Table } from 'dexie';
import { UserWorkoutPlan, WorkoutLog } from '../models';
export interface UserWorkoutPlanEntity extends UserWorkoutPlan {
}
export declare class AppDatabase extends Dexie {
    userWorkoutPlans: Table<UserWorkoutPlanEntity, string>;
    workoutLogs: Table<WorkoutLog, string>;
    constructor();
}
export declare const db: AppDatabase;
