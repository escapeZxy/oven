import { v4 as uuidv4 } from 'uuid';
import { UserWorkoutPlan, WorkoutPlan, CompletedExerciseLog, WorkoutLog, TrainingDay, ScheduleItem } from '../models';
import { IUserWorkoutPlanRepository } from '../repositories/user-workout-plan.repository';
import { WorkoutPlanRepository } from '../repositories/workout-plan.repository';
import { IWorkoutLogRepository } from '../repositories/workout-log.repository';

export class WorkoutService {
  constructor(
    private userWorkoutPlanRepository: IUserWorkoutPlanRepository,
    private workoutPlanRepository: WorkoutPlanRepository,
    private workoutLogRepository: IWorkoutLogRepository
  ) {}

  public async getLastExerciseLog(userId: string, exerciseId: string): Promise<WorkoutLog | null> {
    return this.workoutLogRepository.getLastLog(userId, exerciseId);
  }

  public async getAllLogs(userId: string): Promise<WorkoutLog[]> {
    return this.workoutLogRepository.findAllByUserId(userId);
  }

  public async startPlan(userId: string, workoutPlanId: string): Promise<UserWorkoutPlan> {
    // Check if workout plan exists
    const workoutPlan = await this.workoutPlanRepository.findById(workoutPlanId);
    if (!workoutPlan) {
      throw new Error('Workout plan not found');
    }

    // Deactivate any active plans for the user (mark as interrupted)
    await this.deactivateAllUserPlans(userId);

    // Create new user workout plan
    const newUserPlan: Omit<UserWorkoutPlan, 'id'> = {
      userId,
      workoutPlanId: workoutPlan.id,
      startDate: new Date().toISOString(),
      currentDayIndex: 0,
      isActive: true,
      status: 'active',
      logHistory: [],
    };

    return this.userWorkoutPlanRepository.create(newUserPlan);
  }

  public async resumePlan(userId: string, userPlanId: string): Promise<UserWorkoutPlan> {
    const userPlan = await this.userWorkoutPlanRepository.findById(userPlanId);
    if (!userPlan) {
      throw new Error('User workout plan not found');
    }

    // Deactivate any currently active plans
    await this.deactivateAllUserPlans(userId);

    // Reactivate the target plan
    const updatedPlan: UserWorkoutPlan = {
      ...userPlan,
      isActive: true,
      status: 'active'
    };

    const saved = await this.userWorkoutPlanRepository.update(updatedPlan);
    if (!saved) {
      throw new Error('Failed to update plan status');
    }
    return saved;
  }

  public async archivePlan(userPlanId: string): Promise<UserWorkoutPlan> {
    const userPlan = await this.userWorkoutPlanRepository.findById(userPlanId);
    if (!userPlan) {
      throw new Error('User workout plan not found');
    }

    // We can only archive non-active plans
    if (userPlan.status === 'active' || userPlan.isActive) {
      throw new Error('Cannot archive an active plan');
    }

    const updatedPlan: UserWorkoutPlan = {
      ...userPlan,
      isArchived: true
    };

    const saved = await this.userWorkoutPlanRepository.update(updatedPlan);
    if (!saved) {
      throw new Error('Failed to archive plan');
    }
    return saved;
  }

  private async deactivateAllUserPlans(userId: string): Promise<void> {
    // We need to implement this logic manually since the repository method `deactivateAllUserPlans`
    // might only toggle isActive. We want to set status to 'interrupted' as well.
    // However, the interface IUserWorkoutPlanRepository defines deactivateAllUserPlans(userId).
    // Let's rely on that for isActive, but we should probably update it to handle status too.
    // Or better, let's just find active plans and update them here to be explicit about 'interrupted' status.

    const activePlan = await this.userWorkoutPlanRepository.findActiveByUserId(userId);
    if (activePlan) {
      const updated: UserWorkoutPlan = {
        ...activePlan,
        isActive: false,
        status: 'interrupted'
      };
      await this.userWorkoutPlanRepository.update(updated);
    }
  }

  public async logWorkout(
    userWorkoutPlanId: string,
    completedExercises: CompletedExerciseLog[]
  ): Promise<UserWorkoutPlan> {
    // Get current user workout plan
    const currentPlan = await this.userWorkoutPlanRepository.findById(userWorkoutPlanId);
    if (!currentPlan) {
      throw new Error('User workout plan not found');
    }

    // Get workout plan details
    const workoutPlan = await this.workoutPlanRepository.findById(currentPlan.workoutPlanId);
    if (!workoutPlan) {
      throw new Error('Workout plan not found');
    }

    // Update plan with new log
    const updatedPlan = this._updatePlanWithNewLog(
      currentPlan,
      workoutPlan,
      'completed',
      completedExercises
    );

    // Save updated plan
    const savedPlan = await this.userWorkoutPlanRepository.update(updatedPlan);
    if (!savedPlan) {
      throw new Error('Failed to update user workout plan');
    }

    // Persist to WorkoutLogRepository for history lookup
    const lastLog = updatedPlan.logHistory[updatedPlan.logHistory.length - 1];
    await this.workoutLogRepository.create(lastLog);

    return savedPlan;
  }

  public async skipDay(userWorkoutPlanId: string): Promise<UserWorkoutPlan> {
    // Get current user workout plan
    const currentPlan = await this.userWorkoutPlanRepository.findById(userWorkoutPlanId);
    if (!currentPlan) {
      throw new Error('User workout plan not found');
    }

    // Get workout plan details
    const workoutPlan = await this.workoutPlanRepository.findById(currentPlan.workoutPlanId);
    if (!workoutPlan) {
      throw new Error('Workout plan not found');
    }

    // Update plan with new log
    const updatedPlan = this._updatePlanWithNewLog(
      currentPlan,
      workoutPlan,
      'skipped',
      []
    );

    // Save updated plan
    const savedPlan = await this.userWorkoutPlanRepository.update(updatedPlan);
    if (!savedPlan) {
      throw new Error('Failed to update user workout plan');
    }

    // Persist to WorkoutLogRepository for history lookup
    const lastLog = updatedPlan.logHistory[updatedPlan.logHistory.length - 1];
    await this.workoutLogRepository.create(lastLog);

    return savedPlan;
  }

  public async getActivePlan(userId: string): Promise<UserWorkoutPlan | null> {
    return this.userWorkoutPlanRepository.findActiveByUserId(userId);
  }

  public async getAllPlans(userId: string): Promise<UserWorkoutPlan[]> {
    return this.userWorkoutPlanRepository.findByUserId(userId);
  }

  public async getPlanDefinitions(): Promise<WorkoutPlan[]> {
    return this.workoutPlanRepository.findAll();
  }

  public async createPlanDefinition(planData: Omit<WorkoutPlan, 'id'>): Promise<WorkoutPlan> {
    // Here you could add more complex logic, like ensuring exercise IDs are valid, etc.
    // For now, we just pass it to the repository.
    return this.workoutPlanRepository.create(planData);
  }

  /**
   * Flattens the schedule structure into a linear list of training days.
   * This handles mixing cycles and individual days, and unrolls repeated cycles.
   */
  public flattenPlan(plan: WorkoutPlan): TrainingDay[] {
    if (!plan.schedule || plan.schedule.length === 0) {
      // Fallback to old trainingDays if schedule is missing
      return plan.trainingDays || [];
    }

    return this._flattenScheduleItems(plan.schedule);
  }

  private _flattenScheduleItems(items: ScheduleItem[]): TrainingDay[] {
    const flattened: TrainingDay[] = [];

    for (const item of items) {
      // Check if it's a cycle (has 'type' === 'cycle' OR has 'items' property for safety)
      if ('type' in item && item.type === 'cycle') {
        const cycleDays = this._flattenScheduleItems(item.items);
        for (let i = 0; i < item.repeats; i++) {
          flattened.push(...cycleDays);
        }
      } else {
        // It's a TrainingDay
        // We assume it's a TrainingDay if it's not a cycle.
        // In a strictly typed world, we'd check item.type === 'day' or 'training' or 'rest'
        flattened.push(item as TrainingDay);
      }
    }

    return flattened;
  }

  private _updatePlanWithNewLog(
    currentPlan: UserWorkoutPlan,
    workoutPlan: WorkoutPlan,
    status: 'completed' | 'skipped',
    completedExercises: CompletedExerciseLog[]
  ): UserWorkoutPlan {
    // Use flattenPlan to get the correct linear day
    const allDays = this.flattenPlan(workoutPlan);
    const currentDay = allDays[currentPlan.currentDayIndex];

    if (!currentDay) {
        throw new Error(`Invalid currentDayIndex: ${currentPlan.currentDayIndex}`);
    }

    const trainingDayId = currentDay.id;

    const newLog: WorkoutLog = {
      id: uuidv4(),
      userId: currentPlan.userId,
      workoutPlanId: currentPlan.workoutPlanId,
      trainingDayId,
      date: new Date().toISOString(),
      status,
      completedExercises,
    };

    const isLastDay =
      currentPlan.currentDayIndex === allDays.length - 1;

    return {
      ...currentPlan,
      currentDayIndex: currentPlan.currentDayIndex + 1,
      logHistory: [...currentPlan.logHistory, newLog],
      isActive: !isLastDay,
      status: isLastDay ? 'completed' : 'active',
    };
  }
}
