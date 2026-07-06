import { ScheduleItem, TrainingDay } from '@oven/core';
interface WorkoutPlanStructure {
    schedule?: ScheduleItem[];
    trainingDays?: TrainingDay[];
}
export declare function normalizeWorkoutPlanStructure(planKey: string, plan: WorkoutPlanStructure): WorkoutPlanStructure;
export {};
