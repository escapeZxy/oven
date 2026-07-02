import { WorkoutPlan } from '@oven/core';
export declare class CreateWorkoutPlanDto implements Omit<WorkoutPlan, 'id'> {
    readonly name: string;
    readonly description: string;
    readonly schedule?: WorkoutPlan['schedule'];
    readonly trainingDays?: WorkoutPlan['trainingDays'];
}
