import { UserWorkoutPlanStatus } from '../../generated/prisma/client';
export declare class UpdateUserPlanDto {
    startDate?: string;
    currentDayIndex?: number;
    status?: UserWorkoutPlanStatus;
    isArchived?: boolean;
    isActive?: boolean;
}
