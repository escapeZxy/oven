import Dexie from 'dexie';
import { WorkoutLog } from '../models';
import { IWorkoutLogRepository } from '../repositories/workout-log.repository';
import { db } from './app.database';

export class DexieWorkoutLogRepository implements IWorkoutLogRepository {
  async create(log: WorkoutLog): Promise<void> {
    await db.workoutLogs.add(log);
  }

  async getLastLog(userId: string, exerciseId: string): Promise<WorkoutLog | null> {
    const logs = await db.workoutLogs
      .where('completedExercises.exerciseId')
      .equals(exerciseId)
      .reverse()
      .sortBy('date');

    if (logs.length > 0) {
      const log = logs.find(l => l.userId === userId);
      return log || null;
    }
    return null;
  }

  async findAllByUserId(userId: string): Promise<WorkoutLog[]> {
    return await db.workoutLogs
      .where('userId')
      .equals(userId)
      .reverse()
      .sortBy('date');
  }
}
