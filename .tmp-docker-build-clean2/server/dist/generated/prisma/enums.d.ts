export declare const UserWorkoutPlanStatus: {
    readonly active: "active";
    readonly completed: "completed";
    readonly interrupted: "interrupted";
};
export type UserWorkoutPlanStatus = (typeof UserWorkoutPlanStatus)[keyof typeof UserWorkoutPlanStatus];
export declare const WorkoutLogStatus: {
    readonly completed: "completed";
    readonly skipped: "skipped";
};
export type WorkoutLogStatus = (typeof WorkoutLogStatus)[keyof typeof WorkoutLogStatus];
