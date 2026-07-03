import { WorkoutLog } from '../models';
import { IWorkoutLogRepository } from '../repositories/workout-log.repository';
export declare class DexieWorkoutLogRepository implements IWorkoutLogRepository {
    create(log: WorkoutLog): Promise<void>;
    getLastLog(userId: string, exerciseId: string): Promise<WorkoutLog | null>;
    findAllByUserId(userId: string): Promise<WorkoutLog[]>;
}
