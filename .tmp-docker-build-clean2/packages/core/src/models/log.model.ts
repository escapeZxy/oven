/**
 * Represents the actual performance of a single exercise by the user.
 */
export interface CompletedExerciseLog {
  exerciseId: string;
  /** Actual sets completed by the user. */
  sets: number;
  /** Actual reps for each set. */
  reps: number[];
  /** Weight used for each set. */
  weight: number[];
}

/**
 * A log entry for a single completed (or skipped) training day.
 */
export interface WorkoutLog {
  id: string;
  userId: string;
  workoutPlanId: string;
  trainingDayId: string;
  createdAt?: string;
  updatedAt?: string;
  /** The date the workout was logged. */
  date: string; // ISO 8601 format
  status: 'completed' | 'skipped';
  completedExercises: CompletedExerciseLog[];
}

export type WorkoutVolumeBucket = 'week' | 'month';

/**
 * A single aggregated volume point for a week or month bucket.
 */
export interface WorkoutVolumePoint {
  bucketStart: string;
  bucketEnd: string;
  volume: number;
  completedLogCount: number;
}

/**
 * Aggregated workout volume series for charting and trend analysis.
 */
export interface WorkoutVolumeSummary {
  bucket: WorkoutVolumeBucket;
  points: WorkoutVolumePoint[];
}

/**
 * Aggregated completion summary for finished user plan instances.
 */
export interface UserPlanCompletionSummary {
  completionRate: number;
  completedPlanCount: number;
  interruptedPlanCount: number;
  activePlanCount: number;
  closedPlanCount: number;
}

export type ExerciseTrendDirection = 'up' | 'down' | 'stable' | 'new';

/**
 * A recent point in an exercise's formal training history.
 */
export interface ExerciseTrendPoint {
  loggedAt: string;
  volume: number;
}

/**
 * Trend summary for a single exercise across recent completed logs.
 */
export interface ExerciseTrendItem {
  exerciseId: string;
  latestLogAt: string;
  latestVolume: number;
  previousVolume: number | null;
  changeVolume: number | null;
  changeRate: number | null;
  direction: ExerciseTrendDirection;
  sessionCount: number;
  points: ExerciseTrendPoint[];
}

/**
 * Aggregated recent exercise trend set for dashboard display.
 */
export interface ExerciseTrendSummary {
  items: ExerciseTrendItem[];
}

/**
 * Binds a user to a specific workout plan, tracking their progress.
 */
export interface UserWorkoutPlan {
  id: string;
  userId: string;
  workoutPlanId: string;
  createdAt?: string;
  updatedAt?: string;
  /** The date the user started this plan. */
  startDate: string; // ISO 8601 format
  /** Tracks the sequence of training days. */
  currentDayIndex: number;
  /**
   * Plan lifecycle status:
   * - 'active': Currently in progress (isActive=true)
   * - 'completed': All training days finished
   * - 'interrupted': Switched to another plan or manually stopped
   */
  status: 'active' | 'completed' | 'interrupted';
  /**
   * If true, this plan is hidden from the history list (soft deleted).
   */
  isArchived?: boolean;
  /**
   * @deprecated Use `status === 'active'` instead. Kept for backward compatibility.
   */
  isActive: boolean;
  /** A history of all workout logs for this plan. */
  logHistory: WorkoutLog[];
}
