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
    name: string;
    type: 'training' | 'rest';
    exercises: Exercise[];
}
/**
 * Represents a complete, structured workout plan.
 * e.g., "5x5 StrongLifts", "Push Pull Legs".
 */
export interface WorkoutPlan {
    id: string;
    name: string;
    description: string;
    trainingDays: TrainingDay[];
}
//# sourceMappingURL=plan.model.d.ts.map