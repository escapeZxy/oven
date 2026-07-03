import { WorkoutPlan } from '@oven/core';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { GetWorkoutPlansDto } from './dto/get-workout-plans.dto';
export declare class WorkoutPlansService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAll(query?: GetWorkoutPlansDto): Promise<WorkoutPlan[]>;
    getById(id: string): Promise<WorkoutPlan>;
    create(dto: CreateWorkoutPlanDto): Promise<WorkoutPlan>;
    private mapWorkoutPlan;
    private readSchedule;
    private readTrainingDays;
}
