import { UserWorkoutPlanStatus } from '../../generated/prisma/client';
export declare class CreateUserPlanDto {
    workoutPlanId: string;
    startDate?: string;
    currentDayIndex?: number;
    status?: UserWorkoutPlanStatus;
    isArchived?: boolean;
    isActive?: boolean;
}
