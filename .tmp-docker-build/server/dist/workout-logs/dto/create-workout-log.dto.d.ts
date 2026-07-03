import { WorkoutLogStatus } from '../../generated/prisma/client';
import { CompletedExerciseLogDto } from './completed-exercise-log.dto';
export declare class CreateWorkoutLogDto {
    userPlanId: string;
    workoutPlanId: string;
    trainingDayId: string;
    date?: string;
    status: WorkoutLogStatus;
    completedExercises: CompletedExerciseLogDto[];
}
