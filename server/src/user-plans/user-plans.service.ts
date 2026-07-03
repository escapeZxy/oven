import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {
  CompletedExerciseLog,
  ScheduleItem,
  TrainingDay,
  UserPlanCompletionSummary,
  UserWorkoutPlan,
  WorkoutLog,
} from '@oven/core';
import { PrismaService } from '../prisma/prisma.service';
import {
  Prisma,
  UserWorkoutPlanStatus,
  WorkoutLogStatus,
  type WorkoutPlan as PrismaWorkoutPlan,
  type WorkoutLog as PrismaWorkoutLog,
} from '../generated/prisma/client';
import { CommitUserPlanLogDto } from './dto/commit-user-plan-log.dto';
import { CreateUserPlanDto } from './dto/create-user-plan.dto';
import { GetUserPlansDto } from './dto/get-user-plans.dto';
import { normalizeWorkoutPlanStructure } from '../workout-plans/workout-plan-normalizer';

const userPlanWithLogs = {
  logs: {
    orderBy: {
      date: 'desc',
    },
  },
} satisfies Prisma.UserWorkoutPlanInclude;

type PrismaUserPlanWithLogs = Prisma.UserWorkoutPlanGetPayload<{
  include: typeof userPlanWithLogs;
}>;

const idempotentCommitLogSelect = {
  id: true,
  clientRequestId: true,
  userPlanId: true,
  userId: true,
  workoutPlanId: true,
  trainingDayId: true,
  status: true,
  completedExercises: true,
} satisfies Prisma.WorkoutLogSelect;

type PrismaIdempotentCommitLog = Prisma.WorkoutLogGetPayload<{
  select: typeof idempotentCommitLogSelect;
}>;

type CommitConflictCode =
  | 'user_plan_inactive'
  | 'user_plan_day_advanced'
  | 'training_day_mismatch'
  | 'plan_commit_boundary_changed'
  | 'client_request_reused'
  | 'user_plan_out_of_range';

type CommitConflictRecoveryAction = 'refresh_session' | 'return_dashboard';

interface CommitConflictPayload {
  code: CommitConflictCode;
  message: string;
  recoveryAction: CommitConflictRecoveryAction;
  details?: Record<string, number | string | boolean | null>;
}

/**
 * 封装用户训练计划的持久化读写与领域映射。
 *
 * @example
 * ```ts
 * const plans = await userPlansService.getByUserId('user-1');
 * ```
 */
@Injectable()
export class UserPlansService {
  public constructor(private readonly prisma: PrismaService) {}

  public async getById(id: string, userId: string): Promise<UserWorkoutPlan> {
    const plan = await this.prisma.userWorkoutPlan.findFirst({
      where: { id, userId },
      include: userPlanWithLogs,
    });

    if (!plan) {
      throw new NotFoundException(`User workout plan "${id}" not found.`);
    }

    return this.mapUserPlan(plan);
  }

  public async getByUserId(userId: string, query: GetUserPlansDto = {}): Promise<UserWorkoutPlan[]> {
    const plans = await this.prisma.userWorkoutPlan.findMany({
      where: {
        userId,
        ...(query.updatedAfter
          ? {
              updatedAt: {
                gte: new Date(query.updatedAfter),
              },
            }
          : {}),
      },
      include: userPlanWithLogs,
      orderBy: [{ updatedAt: 'asc' }, { id: 'asc' }],
      take: query.limit,
    });

    return plans.map((plan) => this.mapUserPlan(plan));
  }

  public async getActiveByUserId(userId: string): Promise<UserWorkoutPlan | null> {
    const plan = await this.prisma.userWorkoutPlan.findFirst({
      where: {
        userId,
        status: UserWorkoutPlanStatus.active,
      },
      include: userPlanWithLogs,
      orderBy: { startDate: 'desc' },
    });

    return plan ? this.mapUserPlan(plan) : null;
  }

  public async getCompletionRateSummary(userId: string): Promise<UserPlanCompletionSummary> {
    const plans = await this.prisma.userWorkoutPlan.findMany({
      where: {
        userId,
        isArchived: false,
      },
      select: {
        status: true,
      },
    });
    const completedPlanCount = plans.filter(
      (plan) => plan.status === UserWorkoutPlanStatus.completed,
    ).length;
    const interruptedPlanCount = plans.filter(
      (plan) => plan.status === UserWorkoutPlanStatus.interrupted,
    ).length;
    const activePlanCount = plans.filter(
      (plan) => plan.status === UserWorkoutPlanStatus.active,
    ).length;
    const closedPlanCount = completedPlanCount + interruptedPlanCount;

    return {
      completionRate: closedPlanCount === 0 ? 0 : (completedPlanCount / closedPlanCount) * 100,
      completedPlanCount,
      interruptedPlanCount,
      activePlanCount,
      closedPlanCount,
    };
  }

  public async create(dto: CreateUserPlanDto, userId: string): Promise<UserWorkoutPlan> {
    const state = this.normalizePlanState(dto.status, dto.isActive);
    const createdId = await this.prisma.$transaction(async (prisma) => {
      if (state.status === UserWorkoutPlanStatus.active) {
        await prisma.userWorkoutPlan.updateMany({
          where: {
            userId,
            status: UserWorkoutPlanStatus.active,
          },
          data: {
            status: UserWorkoutPlanStatus.interrupted,
            isActive: false,
          },
        });
      }

      const plan = await prisma.userWorkoutPlan.create({
        data: {
          userId,
          workoutPlanId: dto.workoutPlanId,
          startDate: dto.startDate ? new Date(dto.startDate) : new Date(),
          currentDayIndex: dto.currentDayIndex ?? 0,
          status: state.status,
          isArchived: dto.isArchived ?? false,
          isActive: state.isActive,
        },
      });

      return plan.id;
    });

    return this.getById(createdId, userId);
  }

  /**
   * 原子化写入一次训练日志并推进用户计划，避免前端分两次请求造成日志与计划状态不一致。
   *
   * @example
   * ```ts
   * await userPlansService.appendLog('cup123', {
   *   workoutPlanId: 'plan-1',
   *   trainingDayId: 'day-2',
   *   expectedCurrentDayIndex: 1,
   *   nextDayIndex: 2,
   *   userPlanStatus: UserWorkoutPlanStatus.active,
   *   isActive: true,
   *   logStatus: WorkoutLogStatus.completed,
   *   completedExercises: [],
   * });
   *
   * await userPlansService.appendLog('cup123', {
   *   workoutPlanId: 'plan-1',
   *   trainingDayId: 'day-3',
   *   expectedCurrentDayIndex: 2,
   *   nextDayIndex: 3,
   *   userPlanStatus: UserWorkoutPlanStatus.active,
   *   isActive: true,
   *   logStatus: WorkoutLogStatus.skipped,
   *   completedExercises: [],
   * });
   * ```
   */
  public async appendLog(id: string, dto: CommitUserPlanLogDto, userId: string): Promise<UserWorkoutPlan> {
    const replayedCommit = await this.tryResolveIdempotentReplay(id, dto, userId);
    if (replayedCommit) {
      return replayedCommit;
    }

    const existing = await this.requireOwnedUserPlan(id, userId);
    this.validatePlanOwnership(existing, dto.workoutPlanId);

    if (existing.status !== UserWorkoutPlanStatus.active) {
      this.throwCommitConflict({
        code: 'user_plan_inactive',
        message: `User workout plan "${id}" is no longer active.`,
        recoveryAction: 'return_dashboard',
      });
    }

    if (existing.currentDayIndex !== dto.expectedCurrentDayIndex) {
      this.throwCommitConflict({
        code: 'user_plan_day_advanced',
        message: `User workout plan "${id}" is already at day index ${existing.currentDayIndex}.`,
        recoveryAction: 'refresh_session',
        details: {
          serverCurrentDayIndex: existing.currentDayIndex,
          submittedExpectedDayIndex: dto.expectedCurrentDayIndex,
        },
      });
    }

    if (dto.nextDayIndex !== existing.currentDayIndex + 1) {
      throw new BadRequestException(
        `User workout plan "${id}" must advance exactly one day per commit.`,
      );
    }

    const commitBoundary = await this.resolveCommitBoundary(existing);

    if (dto.trainingDayId !== commitBoundary.currentTrainingDay.id) {
      this.throwCommitConflict({
        code: 'training_day_mismatch',
        message: `User workout plan "${id}" expects trainingDayId "${commitBoundary.currentTrainingDay.id}" at day index ${existing.currentDayIndex}.`,
        recoveryAction: 'refresh_session',
        details: {
          expectedTrainingDayId: commitBoundary.currentTrainingDay.id,
          submittedTrainingDayId: dto.trainingDayId,
          currentDayIndex: existing.currentDayIndex,
        },
      });
    }

    if (dto.userPlanStatus !== commitBoundary.nextStatus || dto.isActive !== commitBoundary.nextIsActive) {
      this.throwCommitConflict({
        code: 'plan_commit_boundary_changed',
        message: `User workout plan "${id}" must commit with status "${commitBoundary.nextStatus}" and isActive=${commitBoundary.nextIsActive}.`,
        recoveryAction: 'refresh_session',
        details: {
          expectedUserPlanStatus: commitBoundary.nextStatus,
          submittedUserPlanStatus: dto.userPlanStatus,
          expectedIsActive: commitBoundary.nextIsActive,
          submittedIsActive: dto.isActive,
        },
      });
    }

    if (dto.logStatus === WorkoutLogStatus.skipped && dto.completedExercises.length > 0) {
      throw new BadRequestException(
        'Skipped workout logs must not include completed exercise payload.',
      );
    }

    if (dto.logStatus === WorkoutLogStatus.completed) {
      this.validateCompletedExercises(dto.completedExercises, commitBoundary.currentTrainingDay);
    }

    try {
      await this.prisma.$transaction(async (prisma) => {
        await prisma.workoutLog.create({
          data: {
            clientRequestId: dto.clientRequestId,
            userPlanId: id,
            userId,
            workoutPlanId: dto.workoutPlanId,
            trainingDayId: dto.trainingDayId,
            date: dto.date ? new Date(dto.date) : new Date(),
            status: dto.logStatus,
            completedExercises: dto.completedExercises as unknown as Prisma.InputJsonValue,
          },
        });

        await prisma.userWorkoutPlan.update({
          where: { id },
          data: {
            currentDayIndex: dto.nextDayIndex,
            status: dto.userPlanStatus,
            isActive: dto.isActive,
          },
        });
      });
    } catch (error) {
      if (this.isClientRequestIdConflict(error)) {
        const concurrentReplay = await this.tryResolveIdempotentReplay(id, dto, userId);
        if (concurrentReplay) {
          return concurrentReplay;
        }
      }

      throw error;
    }

    return this.getById(id, userId);
  }

  public async resume(id: string, userId: string): Promise<UserWorkoutPlan> {
    const existing = await this.requireOwnedUserPlan(id, userId);

    if (existing.isArchived) {
      throw new BadRequestException(
        `Archived user workout plan "${id}" cannot be resumed.`,
      );
    }

    if (existing.status === UserWorkoutPlanStatus.completed) {
      throw new BadRequestException(
        `Completed user workout plan "${id}" cannot be resumed. Start a new plan instance instead.`,
      );
    }

    if (existing.status === UserWorkoutPlanStatus.active && existing.isActive) {
      return this.getById(id, userId);
    }

    await this.prisma.$transaction(async (prisma) => {
      await prisma.userWorkoutPlan.updateMany({
        where: {
          userId: existing.userId,
          id: { not: id },
          status: UserWorkoutPlanStatus.active,
        },
        data: {
          status: UserWorkoutPlanStatus.interrupted,
          isActive: false,
        },
      });

      await prisma.userWorkoutPlan.update({
        where: { id },
        data: {
          status: UserWorkoutPlanStatus.active,
          isActive: true,
        },
      });
    });

    return this.getById(id, userId);
  }

  public async archive(id: string, userId: string): Promise<UserWorkoutPlan> {
    const existing = await this.requireOwnedUserPlan(id, userId);
    this.ensureArchivable(existing);

    if (existing.isArchived) {
      return this.getById(id, userId);
    }

    await this.prisma.userWorkoutPlan.update({
      where: { id },
      data: {
        isArchived: true,
      },
    });

    return this.getById(id, userId);
  }

  private async requireOwnedUserPlan(id: string, userId: string): Promise<{
    id: string;
    userId: string;
    workoutPlanId: string;
    currentDayIndex: number;
    status: UserWorkoutPlanStatus;
    isActive: boolean;
    isArchived: boolean;
  }> {
    const existing = await this.prisma.userWorkoutPlan.findFirst({
      where: { id, userId },
      select: {
        id: true,
        userId: true,
        workoutPlanId: true,
        currentDayIndex: true,
        status: true,
        isActive: true,
        isArchived: true,
      },
    });

    if (!existing) {
      throw new NotFoundException(`User workout plan "${id}" not found.`);
    }

    return existing;
  }

  private validatePlanOwnership(plan: { workoutPlanId: string }, workoutPlanId: string): void {
    if (plan.workoutPlanId !== workoutPlanId) {
      throw new BadRequestException(
        'User workout plan does not match the submitted workoutPlanId.',
      );
    }
  }

  private async tryResolveIdempotentReplay(
    userPlanId: string,
    dto: CommitUserPlanLogDto,
    userId: string,
  ): Promise<UserWorkoutPlan | null> {
    if (!dto.clientRequestId) {
      return null;
    }

    const existingLog = await this.prisma.workoutLog.findUnique({
      where: {
        clientRequestId: dto.clientRequestId,
      },
      select: idempotentCommitLogSelect,
    });

    if (!existingLog) {
      return null;
    }

    this.assertReplayMatchesExistingCommit(existingLog, userPlanId, dto, userId);
    return this.getById(userPlanId, userId);
  }

  private assertReplayMatchesExistingCommit(
    existingLog: PrismaIdempotentCommitLog,
    userPlanId: string,
    dto: CommitUserPlanLogDto,
    userId: string,
  ): void {
    const matchesRequest =
      existingLog.userPlanId === userPlanId &&
      existingLog.userId === userId &&
      existingLog.workoutPlanId === dto.workoutPlanId &&
      existingLog.trainingDayId === dto.trainingDayId &&
      existingLog.status === dto.logStatus &&
      this.haveSameCompletedExercises(existingLog, dto.completedExercises);

    if (matchesRequest) {
      return;
    }

    this.throwCommitConflict({
      code: 'client_request_reused',
      message: `clientRequestId "${dto.clientRequestId}" is already bound to a different workout commit.`,
      recoveryAction: 'return_dashboard',
    });
  }

  private haveSameCompletedExercises(
    existingLog: PrismaIdempotentCommitLog,
    submittedExercises: CompletedExerciseLog[],
  ): boolean {
    return (
      JSON.stringify(this.readCompletedExercises(existingLog.completedExercises)) ===
      JSON.stringify(submittedExercises)
    );
  }

  private isClientRequestIdConflict(error: unknown): boolean {
    if (
      typeof error !== 'object' ||
      error === null ||
      !('code' in error) ||
      error.code !== 'P2002' ||
      !('meta' in error)
    ) {
      return false;
    }

    const meta = error.meta;
    if (typeof meta !== 'object' || meta === null || !('target' in meta)) {
      return false;
    }

    const target = meta.target;
    return Array.isArray(target) && target.includes('clientRequestId');
  }

  private async resolveCommitBoundary(plan: {
    id: string;
    workoutPlanId: string;
    currentDayIndex: number;
  }): Promise<{
    currentTrainingDay: TrainingDay;
    nextStatus: UserWorkoutPlanStatus;
    nextIsActive: boolean;
  }> {
    const workoutPlan = await this.prisma.workoutPlan.findUnique({
      where: { id: plan.workoutPlanId },
    });

    if (!workoutPlan) {
      throw new BadRequestException(
        `Referenced workout plan "${plan.workoutPlanId}" not found for user plan "${plan.id}".`,
      );
    }

    const trainingDays = this.flattenWorkoutPlan(workoutPlan);
    const currentTrainingDay = trainingDays[plan.currentDayIndex];

    if (!currentTrainingDay) {
      this.throwCommitConflict({
        code: 'user_plan_out_of_range',
        message: `User workout plan "${plan.id}" currentDayIndex ${plan.currentDayIndex} is out of range.`,
        recoveryAction: 'return_dashboard',
        details: {
          currentDayIndex: plan.currentDayIndex,
        },
      });
    }

    const isLastTrainingDay = plan.currentDayIndex === trainingDays.length - 1;

    return {
      currentTrainingDay,
      nextStatus: isLastTrainingDay
        ? UserWorkoutPlanStatus.completed
        : UserWorkoutPlanStatus.active,
      nextIsActive: !isLastTrainingDay,
    };
  }

  private ensureArchivable(existing: {
    status: UserWorkoutPlanStatus;
    isActive: boolean;
  }): void {
    if (existing.status === UserWorkoutPlanStatus.active || existing.isActive) {
      throw new BadRequestException('Cannot archive an active plan.');
    }
  }

  private throwCommitConflict(payload: CommitConflictPayload): never {
    throw new ConflictException(payload);
  }

  private normalizePlanState(
    status?: UserWorkoutPlanStatus,
    isActive?: boolean,
  ): { status: UserWorkoutPlanStatus; isActive: boolean } {
    if (status !== undefined) {
      return {
        status,
        isActive: status === UserWorkoutPlanStatus.active,
      };
    }

    if (isActive !== undefined) {
      return {
        status: isActive ? UserWorkoutPlanStatus.active : UserWorkoutPlanStatus.interrupted,
        isActive,
      };
    }

    return {
      status: UserWorkoutPlanStatus.active,
      isActive: true,
    };
  }

  private validateCompletedExercises(
    exercises: CompletedExerciseLog[],
    trainingDay: TrainingDay,
  ): void {
    if (trainingDay.type === 'rest') {
      if (exercises.length > 0) {
        throw new BadRequestException(
          `Rest day "${trainingDay.id}" must not include completed exercise payload.`,
        );
      }

      return;
    }

    if (exercises.length === 0) {
      throw new BadRequestException(
        'Completed workout logs must include at least one completed set.',
      );
    }

    for (const exercise of exercises) {
      if (exercise.sets <= 0) {
        throw new BadRequestException(
          `Exercise "${exercise.exerciseId}" must include at least one completed set.`,
        );
      }

      if (
        exercise.reps.length !== exercise.sets ||
        exercise.weight.length !== exercise.sets
      ) {
        throw new BadRequestException(
          `Exercise "${exercise.exerciseId}" has inconsistent completed set payload.`,
        );
      }
    }
  }

  private mapUserPlan(plan: PrismaUserPlanWithLogs): UserWorkoutPlan {
    return {
      id: plan.id,
      userId: plan.userId,
      workoutPlanId: plan.workoutPlanId,
      createdAt: (plan.createdAt ?? plan.startDate).toISOString(),
      updatedAt: (plan.updatedAt ?? plan.startDate).toISOString(),
      startDate: plan.startDate.toISOString(),
      currentDayIndex: plan.currentDayIndex,
      status: plan.status,
      isArchived: plan.isArchived,
      isActive: plan.isActive,
      logHistory: plan.logs.map((log) => this.mapWorkoutLog(log)),
    };
  }

  private mapWorkoutLog(log: PrismaWorkoutLog): WorkoutLog {
    return {
      id: log.id,
      userId: log.userId,
      workoutPlanId: log.workoutPlanId,
      trainingDayId: log.trainingDayId,
      createdAt: (log.createdAt ?? log.date).toISOString(),
      updatedAt: (log.updatedAt ?? log.date).toISOString(),
      date: log.date.toISOString(),
      status: log.status as WorkoutLogStatus as WorkoutLog['status'],
      completedExercises: this.readCompletedExercises(log.completedExercises),
    };
  }

  private flattenWorkoutPlan(plan: PrismaWorkoutPlan): TrainingDay[] {
    const normalized = normalizeWorkoutPlanStructure(plan.id, {
      schedule: this.readSchedule(plan.schedule),
      trainingDays: this.readTrainingDays(plan.trainingDays),
    });
    const schedule = normalized.schedule;

    if (schedule && schedule.length > 0) {
      return this.flattenScheduleItems(schedule);
    }

    return normalized.trainingDays ?? [];
  }

  private flattenScheduleItems(items: ScheduleItem[]): TrainingDay[] {
    const flattened: TrainingDay[] = [];

    for (const item of items) {
      if ('type' in item && item.type === 'cycle') {
        const cycleDays = this.flattenScheduleItems(item.items);

        for (let index = 0; index < item.repeats; index += 1) {
          flattened.push(...cycleDays);
        }

        continue;
      }

      flattened.push(item as TrainingDay);
    }

    return flattened;
  }

  private readSchedule(value: Prisma.JsonValue | null): ScheduleItem[] | undefined {
    if (value === null) {
      return undefined;
    }

    if (!Array.isArray(value)) {
      throw new Error('Invalid workout plan schedule stored in database.');
    }

    return value as unknown as ScheduleItem[];
  }

  private readTrainingDays(value: Prisma.JsonValue | null): TrainingDay[] {
    if (value === null) {
      return [];
    }

    if (!Array.isArray(value)) {
      throw new Error('Invalid workout plan trainingDays stored in database.');
    }

    return value as unknown as TrainingDay[];
  }

  private readCompletedExercises(value: Prisma.JsonValue): CompletedExerciseLog[] {
    if (!Array.isArray(value)) {
      throw new Error('Invalid workout log payload stored in database.');
    }

    return value as unknown as CompletedExerciseLog[];
  }
}
