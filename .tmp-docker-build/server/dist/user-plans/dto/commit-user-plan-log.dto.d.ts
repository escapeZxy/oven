import { UserWorkoutPlanStatus, WorkoutLogStatus } from '../../generated/prisma/client';
import { CompletedExerciseLogDto } from '../../workout-logs/dto/completed-exercise-log.dto';
export declare class CommitUserPlanLogDto {
    clientRequestId?: string;
    workoutPlanId: string;
    trainingDayId: string;
    expectedCurrentDayIndex: number;
    nextDayIndex: number;
    userPlanStatus: UserWorkoutPlanStatus;
    isActive: boolean;
    logStatus: WorkoutLogStatus;
    date?: string;
    completedExercises: CompletedExerciseLogDto[];
}
