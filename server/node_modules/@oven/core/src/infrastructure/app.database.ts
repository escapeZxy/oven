import Dexie, { Table } from 'dexie';
import { UserWorkoutPlan, WorkoutLog } from '../models';

// Dexie Entity Definition
// In this case, it matches the domain model, but we define it separately to keep layers clean.
export interface UserWorkoutPlanEntity extends UserWorkoutPlan {}

export class AppDatabase extends Dexie {
  userWorkoutPlans!: Table<UserWorkoutPlanEntity, string>;
  workoutLogs!: Table<WorkoutLog, string>;

  constructor() {
    super('OvenDB');
    this.version(2).stores({
      // Indexing strategy:
      // id: Primary Key
      // userId: Frequent query for user's plans
      // workoutPlanId: Query for specific plan types
      userWorkoutPlans: 'id, userId, workoutPlanId',
      // Indexing strategy:
      // id: Primary Key
      // userId: Frequent query for user's logs
      // *completedExercises.exerciseId: Multi-entry index for exercise lookup
      // date: For sorting
      workoutLogs: '++id, userId, *completedExercises.exerciseId, date',
    });
  }
}

export const db = new AppDatabase();
