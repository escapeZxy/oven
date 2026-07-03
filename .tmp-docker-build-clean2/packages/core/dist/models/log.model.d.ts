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
    /** The date the workout was logged. */
    date: string;
    status: 'completed' | 'skipped';
    completedExercises: CompletedExerciseLog[];
}
/**
 * Binds a user to a specific workout plan, tracking their progress.
 */
export interface UserWorkoutPlan {
    id: string;
    userId: string;
    workoutPlanId: string;
    /** The date the user started this plan. */
    startDate: string;
    /** Tracks the sequence of training days. */
    currentDayIndex: number;
    isActive: boolean;
    /** A history of all workout logs for this plan. */
    logHistory: WorkoutLog[];
}
//# sourceMappingURL=log.model.d.ts.map