export interface CompletedExerciseLog {
    exerciseId: string;
    sets: number;
    reps: number[];
    weight: number[];
}
export interface WorkoutLog {
    id: string;
    userId: string;
    workoutPlanId: string;
    trainingDayId: string;
    date: string;
    status: 'completed' | 'skipped';
    completedExercises: CompletedExerciseLog[];
}
export interface UserWorkoutPlan {
    id: string;
    userId: string;
    workoutPlanId: string;
    startDate: string;
    currentDayIndex: number;
    status: 'active' | 'completed' | 'interrupted';
    isArchived?: boolean;
    isActive: boolean;
    logHistory: WorkoutLog[];
}
