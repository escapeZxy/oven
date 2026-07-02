export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: number;
}
export interface TrainingDay {
    id: string;
    type: 'day' | 'training' | 'rest';
    name: string;
    exercises: Exercise[];
}
export interface TrainingCycle {
    id: string;
    type: 'cycle';
    name: string;
    description?: string;
    repeats: number;
    items: ScheduleItem[];
}
export type ScheduleItem = TrainingDay | TrainingCycle;
export interface WorkoutPlan {
    id: string;
    name: string;
    description: string;
    schedule?: ScheduleItem[];
    trainingDays?: TrainingDay[];
}
