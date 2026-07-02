/**
 * Represents a single, specific exercise.
 * e.g., Squat, Bench Press, Deadlift.
 */
export interface Exercise {
  id: string;
  name: string;
  /** Suggested sets for this exercise. */
  sets: number;
  /** Suggested reps for each set. */
  reps: number;
}

/**
 * Represents a single day of training within a workout plan.
 * It can be a training day with exercises or a rest day.
 */
export interface TrainingDay {
  id: string;
  type: 'day' | 'training' | 'rest'; // Added 'day' for consistency with ScheduleItem, kept old types for compatibility
  name: string;
  // type property is used for discriminated union if we strictly enforce 'day', 
  // but for backward compatibility we might see 'training' or 'rest' here.
  // We will normalize this in logic.
  exercises: Exercise[];
}

/**
 * Represents a structured cycle of training days that repeats.
 * e.g., "Hypertrophy Phase" (4 weeks), "Deload" (1 week).
 */
export interface TrainingCycle {
  id: string;
  type: 'cycle';
  name: string;
  description?: string;
  repeats: number;
  items: ScheduleItem[];
}

/**
 * Unified type for items in a workout schedule.
 * Can be a single day or a repeating cycle.
 */
export type ScheduleItem = TrainingDay | TrainingCycle;

/**
 * Represents a complete, structured workout plan.
 * e.g., "5x5 StrongLifts", "Push Pull Legs".
 */
export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  
  /**
   * The structured schedule of the plan.
   * This allows mixing cycles and individual days in a linear order.
   */
  schedule?: ScheduleItem[];

  /**
   * Flat list of training days.
   * @deprecated Use `schedule` for new plans. Kept for backward compatibility.
   */
  trainingDays?: TrainingDay[];
}
