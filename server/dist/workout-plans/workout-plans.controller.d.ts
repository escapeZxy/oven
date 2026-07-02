import { WorkoutPlan } from '@oven/core';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { GetWorkoutPlansDto } from './dto/get-workout-plans.dto';
import { WorkoutPlansService } from './workout-plans.service';
export declare class WorkoutPlansController {
    private readonly workoutPlansService;
    constructor(workoutPlansService: WorkoutPlansService);
    getAll(query: GetWorkoutPlansDto): Promise<WorkoutPlan[]>;
    getById(id: string): Promise<WorkoutPlan>;
    create(dto: CreateWorkoutPlanDto): Promise<WorkoutPlan>;
}
