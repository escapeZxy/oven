import { WorkoutLog } from '../models';
export interface IWorkoutLogRepository {
    create(log: WorkoutLog): Promise<void>;
    getLastLog(userId: string, exerciseId: string): Promise<WorkoutLog | null>;
    findAllByUserId(userId: string): Promise<WorkoutLog[]>;
}
