import { InjectionToken, Provider } from '@angular/core';
import {
  IUserWorkoutPlanRepository,
  InMemoryUserWorkoutPlanRepository,
  DexieUserWorkoutPlanRepository,
  WorkoutPlanRepository,
  WorkoutService,
  IWorkoutLogRepository,
  DexieWorkoutLogRepository,
} from '@oven/core';

// Create injection tokens
// Note: We use the Interface type for the Token generic, so consumers depend on the interface, not the implementation.
export const USER_WORKOUT_PLAN_REPOSITORY = new InjectionToken<IUserWorkoutPlanRepository>('UserWorkoutPlanRepository');
export const WORKOUT_PLAN_REPOSITORY = new InjectionToken<WorkoutPlanRepository>('WorkoutPlanRepository');
export const WORKOUT_LOG_REPOSITORY = new InjectionToken<IWorkoutLogRepository>('WorkoutLogRepository');
export const WORKOUT_SERVICE = new InjectionToken<WorkoutService>('WorkoutService');

// Create factory providers
export const CORE_PROVIDERS: Provider[] = [
  {
    provide: USER_WORKOUT_PLAN_REPOSITORY,
    // SWITCH IMPLEMENTATION HERE:
    // useFactory: () => new InMemoryUserWorkoutPlanRepository(), // Old Mock
    useFactory: () => new DexieUserWorkoutPlanRepository(), // New IndexedDB
  },
  {
    provide: WORKOUT_PLAN_REPOSITORY,
    useFactory: () => new WorkoutPlanRepository(),
  },
  {
    provide: WORKOUT_LOG_REPOSITORY,
    useFactory: () => new DexieWorkoutLogRepository(),
  },
  {
    provide: WORKOUT_SERVICE,
    // We cast to any because TS might complain about the Interface vs Class matching in factory args,
    // but at runtime DI handles it correctly.
    useFactory: (
      userWorkoutPlanRepo: IUserWorkoutPlanRepository,
      workoutPlanRepo: WorkoutPlanRepository,
      workoutLogRepo: IWorkoutLogRepository
    ) => new WorkoutService(userWorkoutPlanRepo, workoutPlanRepo, workoutLogRepo),
    deps: [USER_WORKOUT_PLAN_REPOSITORY, WORKOUT_PLAN_REPOSITORY, WORKOUT_LOG_REPOSITORY],
  },
];
