import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, Signal, computed, effect, inject, signal, untracked } from '@angular/core';
import {
  CompletedExerciseLog,
  ExerciseTrendSummary,
  UserPlanCompletionSummary,
  UserWorkoutPlan,
  WorkoutLog,
  WorkoutPlan,
  WorkoutVolumeSummary,
} from '@oven/core';
import { WORKOUT_SERVICE } from '../../../core.providers';
import { AuthService } from '../../../auth/auth.service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface CommitUserPlanLogRequest {
  clientRequestId?: string;
  workoutPlanId: string;
  trainingDayId: string;
  expectedCurrentDayIndex: number;
  nextDayIndex: number;
  userPlanStatus: UserWorkoutPlan['status'];
  isActive: boolean;
  date?: string;
  logStatus: WorkoutLog['status'];
  completedExercises: CompletedExerciseLog[];
}

interface CreateUserPlanRequest {
  workoutPlanId: string;
  currentDayIndex?: number;
  status?: UserWorkoutPlan['status'];
}

export interface WorkoutPlanViewModel extends WorkoutPlan {
  userPlanId: string;
  startDate: string;
  currentDayIndex: number;
  currentTrainingDayId: string | null;
  isActive: boolean;
  status?: 'active' | 'completed' | 'interrupted';
  isArchived?: boolean;
}

type SyncStatus = 'idle' | 'syncing' | 'error';

type WorkoutConflictCode =
  | 'user_plan_inactive'
  | 'user_plan_day_advanced'
  | 'training_day_mismatch'
  | 'plan_commit_boundary_changed'
  | 'client_request_reused'
  | 'user_plan_out_of_range';

type WorkoutConflictRecoveryAction = 'refresh_session' | 'return_dashboard';

interface WorkoutConflictPayload {
  code?: WorkoutConflictCode;
  message?: string | string[];
  recoveryAction?: WorkoutConflictRecoveryAction;
  details?: Record<string, unknown>;
}

export class WorkoutDataConflictError extends Error {
  public constructor(
    message: string,
    public readonly code: WorkoutConflictCode,
    public readonly recoveryAction: WorkoutConflictRecoveryAction,
    public readonly sessionAvailableAfterSync: boolean,
  ) {
    super(message);
    this.name = 'WorkoutDataConflictError';
  }
}

@Injectable({
  providedIn: 'root',
})
export class WorkoutLogService {
  private readonly http = inject(HttpClient);
  private readonly workoutService = inject(WORKOUT_SERVICE);
  private readonly authService = inject(AuthService);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  private readonly _userPlans = signal<UserWorkoutPlan[]>([]);
  private readonly _weeklyVolume = signal<WorkoutVolumeSummary | null>(null);
  private readonly _monthlyVolume = signal<WorkoutVolumeSummary | null>(null);
  private readonly _planCompletionSummary = signal<UserPlanCompletionSummary | null>(null);
  private readonly _exerciseTrendSummary = signal<ExerciseTrendSummary | null>(null);
  private readonly _syncStatus = signal<SyncStatus>('idle');
  private readonly _lastSyncedAt = signal<string | null>(null);
  private readonly _syncError = signal<string | null>(null);
  private readonly _planDefinitionsCursor = signal<string | null>(null);
  private readonly _userPlansCursor = signal<string | null>(null);
  private lastAuthenticatedUserId: string | null = null;
  public readonly availablePlans = signal<WorkoutPlan[]>([]);
  public readonly weeklyVolume = computed(() => this._weeklyVolume());
  public readonly monthlyVolume = computed(() => this._monthlyVolume());
  public readonly planCompletionSummary = computed(() => this._planCompletionSummary());
  public readonly exerciseTrendSummary = computed(() => this._exerciseTrendSummary());
  public readonly syncStatus = computed(() => this._syncStatus());
  public readonly lastSyncedAt = computed(() => this._lastSyncedAt());
  public readonly syncError = computed(() => this._syncError());

  public readonly activePlan = computed<WorkoutPlanViewModel | null>(() => {
    const userPlans = this._userPlans();
    const definitions = this.availablePlans();
    if (!userPlans.length || !definitions.length) {
      return null;
    }

    // Find the plan with status === 'active' (or fallback to isActive for old data)
    const activeUserPlan = userPlans.find(
      (userPlan) => userPlan.status === 'active' || (userPlan.isActive && !userPlan.status),
    );
    if (!activeUserPlan) {
      return null;
    }

    const definition = definitions.find((def) => def.id === activeUserPlan.workoutPlanId);
    if (!definition) {
      return null;
    }

    const flatDays = this.workoutService.flattenPlan(definition);

    return {
      ...definition,
      trainingDays: flatDays,
      userPlanId: activeUserPlan.id,
      startDate: activeUserPlan.startDate,
      currentDayIndex: activeUserPlan.currentDayIndex,
      currentTrainingDayId: flatDays[activeUserPlan.currentDayIndex]?.id ?? null,
      isActive: activeUserPlan.isActive,
      status: activeUserPlan.status,
      isArchived: activeUserPlan.isArchived,
    };
  });

  public readonly historyPlans = computed<WorkoutPlanViewModel[]>(() => {
    const userPlans = this._userPlans();
    const definitions = this.availablePlans();
    if (!userPlans.length || !definitions.length) {
      return [];
    }

    const historyPlans: WorkoutPlanViewModel[] = [];

    for (const userPlan of userPlans
      .filter(
        (plan) =>
          (plan.status === 'completed' ||
            plan.status === 'interrupted' ||
            (!plan.isActive && !plan.status)) &&
          !plan.isArchived,
      )
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())) {
      const definition = definitions.find((plan) => plan.id === userPlan.workoutPlanId);
      if (!definition) {
        continue;
      }

      historyPlans.push({
        ...definition,
        trainingDays: this.workoutService.flattenPlan(definition),
        userPlanId: userPlan.id,
        startDate: userPlan.startDate,
        currentDayIndex: userPlan.currentDayIndex,
        currentTrainingDayId:
          this.workoutService.flattenPlan(definition)[userPlan.currentDayIndex]?.id ?? null,
        isActive: userPlan.isActive,
        status: userPlan.status,
        isArchived: userPlan.isArchived,
      });
    }

    return historyPlans;
  });

  private readonly currentUser = this.authService.currentUser;

  constructor() {
    effect(() => {
      const user = this.currentUser();
      if (user) {
        const isUserChanged = this.lastAuthenticatedUserId !== user.id;
        if (isUserChanged) {
          this.lastAuthenticatedUserId = user.id;
          this._userPlans.set([]);
          this._weeklyVolume.set(null);
          this._monthlyVolume.set(null);
          this._planCompletionSummary.set(null);
          this._exerciseTrendSummary.set(null);
          this._lastSyncedAt.set(null);
          this._syncError.set(null);
          this._planDefinitionsCursor.set(null);
          this._userPlansCursor.set(null);
          this.availablePlans.set([]);
        }

        untracked(() => {
          void this.refreshDashboardData({
            forceFullSync: isUserChanged,
          });
        });
      } else {
        this.lastAuthenticatedUserId = null;
        this._userPlans.set([]);
        this._weeklyVolume.set(null);
        this._monthlyVolume.set(null);
        this._planCompletionSummary.set(null);
        this._exerciseTrendSummary.set(null);
        this._syncStatus.set('idle');
        this._lastSyncedAt.set(null);
        this._syncError.set(null);
        this._planDefinitionsCursor.set(null);
        this._userPlansCursor.set(null);
        this.availablePlans.set([]);
      }
    });
  }

  public async syncNow(options: { forceFullSync?: boolean } = {}): Promise<void> {
    await this.refreshDashboardData(options);
  }

  private async refreshDashboardData(options: { forceFullSync?: boolean } = {}): Promise<void> {
    if (this._syncStatus() === 'syncing') {
      return;
    }

    this._syncStatus.set('syncing');
    this._syncError.set(null);

    try {
      const planDefinitionsCursor = options.forceFullSync ? null : this._planDefinitionsCursor();
      const userPlansCursor = options.forceFullSync ? null : this._userPlansCursor();
      const [
        definitions,
        plans,
        weeklyVolume,
        monthlyVolume,
        planCompletionSummary,
        exerciseTrendSummary,
      ] = await Promise.all([
        this.loadPlanDefinitions(planDefinitionsCursor),
        this.loadUserPlans(userPlansCursor),
        this.loadVolumeSummary('week', 8),
        this.loadVolumeSummary('month', 6),
        this.loadPlanCompletionSummary(),
        this.loadExerciseTrendSummary(),
      ]);

      this.availablePlans.set(this.normalizePlanDefinitions(this.mergeById(this.availablePlans(), definitions)));
      this._userPlans.set(this.mergeById(this._userPlans(), plans));
      this._weeklyVolume.set(weeklyVolume);
      this._monthlyVolume.set(monthlyVolume);
      this._planCompletionSummary.set(planCompletionSummary);
      this._exerciseTrendSummary.set(exerciseTrendSummary);
      this._planDefinitionsCursor.set(this.resolveNextCursor(this._planDefinitionsCursor(), definitions));
      this._userPlansCursor.set(this.resolveNextCursor(this._userPlansCursor(), plans));
      this._lastSyncedAt.set(new Date().toISOString());
      this._syncStatus.set('idle');
    } catch (error) {
      this._syncStatus.set('error');
      this._syncError.set(this.resolveSyncErrorMessage(error));
      console.error('Failed to refresh workout dashboard data:', error);
    }
  }

  private async loadPlanDefinitions(updatedAfter: string | null): Promise<WorkoutPlan[]> {
    return firstValueFrom(
      this.http.get<WorkoutPlan[]>(`${this.apiBaseUrl}/workout-plans`, {
        params: this.buildSyncParams(updatedAfter),
      }),
    );
  }

  private async loadUserPlans(updatedAfter: string | null): Promise<UserWorkoutPlan[]> {
    return firstValueFrom(
      this.http.get<UserWorkoutPlan[]>(`${this.apiBaseUrl}/user-plans`, {
        params: this.buildSyncParams(updatedAfter),
      }),
    );
  }

  private async loadLogs(): Promise<WorkoutLog[]> {
    return firstValueFrom(
      this.http.get<WorkoutLog[]>(`${this.apiBaseUrl}/workout-logs`),
    );
  }

  private async loadVolumeSummary(
    bucket: WorkoutVolumeSummary['bucket'],
    limit: number,
  ): Promise<WorkoutVolumeSummary> {
    return firstValueFrom(
      this.http.get<WorkoutVolumeSummary>(`${this.apiBaseUrl}/workout-logs/volume`, {
        params: this.buildParams({
          bucket,
          limit,
        }),
      }),
    );
  }

  private async loadPlanCompletionSummary(): Promise<UserPlanCompletionSummary> {
    return firstValueFrom(
      this.http.get<UserPlanCompletionSummary>(`${this.apiBaseUrl}/user-plans/completion-rate`),
    );
  }

  private async loadExerciseTrendSummary(): Promise<ExerciseTrendSummary> {
    return firstValueFrom(
      this.http.get<ExerciseTrendSummary>(`${this.apiBaseUrl}/workout-logs/exercise-trends`, {
        params: this.buildParams({
          limit: 6,
        }),
      }),
    );
  }

  async logWorkout(userPlanId: string, completedExercises: CompletedExerciseLog[]): Promise<void> {
    try {
      await this.submitWorkoutSession(userPlanId, 'completed', completedExercises);
    } catch (error) {
      console.error('Failed to log workout:', error);
      throw error;
    }
  }

  async skipDay(userPlanId: string): Promise<void> {
    try {
      await this.submitWorkoutSession(userPlanId, 'skipped');
    } catch (error) {
      console.error('Failed to skip day:', error);
      throw error;
    }
  }

  async startWorkoutSession(userPlanId: string): Promise<void> {
    console.log('Starting workout for user plan:', userPlanId);
  }

  async createPlan(planData: Omit<WorkoutPlan, 'id'>): Promise<void> {
    const user = this.currentUser();
    if (!user) {
      throw new Error('用户未登录');
    }

    const newPlanDefinition = await this.createPlanDefinition(planData);
    await this.createUserPlan({
      workoutPlanId: newPlanDefinition.id,
      currentDayIndex: 0,
      status: 'active',
    });
    await this.refreshDashboardData();
  }

  async startExistingPlan(planId: string): Promise<void> {
    const user = this.currentUser();
    if (!user) {
      throw new Error('用户未登录');
    }

    await this.createUserPlan({
      workoutPlanId: planId,
      currentDayIndex: 0,
      status: 'active',
    });
    await this.refreshDashboardData();
  }

  async resumePlan(userPlanId: string): Promise<void> {
    const user = this.currentUser();
    if (!user) {
      throw new Error('用户未登录');
    }

    await this.resumeUserPlan(userPlanId);
    await this.refreshDashboardData();
  }

  async archivePlan(userPlanId: string): Promise<void> {
    const user = this.currentUser();
    if (!user) {
      throw new Error('用户未登录');
    }

    await this.archiveUserPlan(userPlanId);
    await this.refreshDashboardData();
  }

  async getLastExerciseLog(exerciseId: string): Promise<WorkoutLog | null> {
    const user = this.currentUser();
    if (!user) {
      return null;
    }
    return firstValueFrom(
      this.http.get<WorkoutLog | null>(`${this.apiBaseUrl}/workout-logs/last`, {
        params: this.buildParams({
          exerciseId,
        }),
      }),
    );
  }

  async getAllLogs(): Promise<WorkoutLog[]> {
    return this.loadLogs();
  }

  async submitWorkoutSession(
    userPlanId: string,
    status: WorkoutLog['status'],
    completedExercises: CompletedExerciseLog[] = [],
    clientRequestId?: string,
  ): Promise<void> {
    const user = this.currentUser();
    if (!user) {
      throw new Error('用户未登录');
    }

    const userPlan = this.getUserPlanOrThrow(userPlanId);
    const definition = this.getPlanDefinitionOrThrow(userPlan.workoutPlanId);
    const trainingDays = this.workoutService.flattenPlan(definition);
    const currentTrainingDay = trainingDays[userPlan.currentDayIndex];

    if (!currentTrainingDay) {
      throw new Error('当前训练日不存在，无法提交记录。');
    }

    const nextDayIndex = userPlan.currentDayIndex + 1;
    const isCompletedPlan = nextDayIndex >= trainingDays.length;
    const payload: CommitUserPlanLogRequest = {
      clientRequestId,
      workoutPlanId: userPlan.workoutPlanId,
      trainingDayId: currentTrainingDay.id,
      expectedCurrentDayIndex: userPlan.currentDayIndex,
      nextDayIndex,
      userPlanStatus: isCompletedPlan ? 'completed' : 'active',
      isActive: !isCompletedPlan,
      logStatus: status,
      completedExercises,
    };

    try {
      await firstValueFrom(
        this.http.post<UserWorkoutPlan>(`${this.apiBaseUrl}/user-plans/${userPlan.id}/logs`, payload),
      );
      await this.refreshDashboardData();
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 409) {
        const conflict = this.parseWorkoutConflict(error.error);
        const sessionAvailableAfterSync = await this.recoverFromSubmitConflict(userPlan.id);
        const conflictMessage = this.resolveConflictMessage(conflict, sessionAvailableAfterSync);
        throw new WorkoutDataConflictError(
          conflictMessage,
          conflict.code,
          conflict.recoveryAction,
          sessionAvailableAfterSync,
        );
      }

      if (error instanceof HttpErrorResponse && error.status === 0) {
        throw new Error('无法连接服务端，已保留本地草稿，请稍后重试。');
      }

      if (error instanceof HttpErrorResponse && error.status === 401) {
        throw new Error('登录已失效，请重新登录后再提交训练。');
      }

      throw new Error(this.toErrorMessage(error, '训练会话提交失败'));
    }
  }

  getTodaysWorkout(userPlanIdSignal: Signal<string | null | undefined>) {
    return computed(() => {
      const userPlanId = userPlanIdSignal();
      if (!userPlanId) {
        return null;
      }
      const plans = this._userPlans();
      const definitions = this.availablePlans();
      const userPlan = plans.find((plan) => plan.id === userPlanId);
      if (!userPlan) {
        return null;
      }
      const planDefinition = definitions.find((plan) => plan.id === userPlan.workoutPlanId);
      if (!planDefinition) {
        return null;
      }

      const dayIndex = userPlan.currentDayIndex;
      const allDays = this.workoutService.flattenPlan(planDefinition);
      const workoutDay = allDays[dayIndex];

      if (!workoutDay) {
        return null;
      }

      return {
        planName: planDefinition.name,
        dayName: workoutDay.name,
        trainingDayId: workoutDay.id,
        currentDayIndex: dayIndex,
        exercises: workoutDay.exercises,
      };
    });
  }

  private async createUserPlan(payload: CreateUserPlanRequest): Promise<UserWorkoutPlan> {
    try {
      return await firstValueFrom(
        this.http.post<UserWorkoutPlan>(`${this.apiBaseUrl}/user-plans`, payload),
      );
    } catch (error) {
      throw new Error(this.toErrorMessage(error, '训练计划创建失败'));
    }
  }

  private async createPlanDefinition(planData: Omit<WorkoutPlan, 'id'>): Promise<WorkoutPlan> {
    try {
      return await firstValueFrom(
        this.http.post<WorkoutPlan>(`${this.apiBaseUrl}/workout-plans`, planData),
      );
    } catch (error) {
      throw new Error(this.toErrorMessage(error, '训练计划定义创建失败'));
    }
  }

  private async resumeUserPlan(userPlanId: string): Promise<UserWorkoutPlan> {
    try {
      return await firstValueFrom(
        this.http.post<UserWorkoutPlan>(`${this.apiBaseUrl}/user-plans/${userPlanId}/resume`, {}),
      );
    } catch (error) {
      throw new Error(this.toErrorMessage(error, '恢复训练计划失败'));
    }
  }

  private async archiveUserPlan(userPlanId: string): Promise<UserWorkoutPlan> {
    try {
      return await firstValueFrom(
        this.http.post<UserWorkoutPlan>(`${this.apiBaseUrl}/user-plans/${userPlanId}/archive`, {}),
      );
    } catch (error) {
      throw new Error(this.toErrorMessage(error, '归档训练计划失败'));
    }
  }

  private getUserPlanOrThrow(userPlanId: string): UserWorkoutPlan {
    const userPlan = this._userPlans().find((plan) => plan.id === userPlanId);
    if (!userPlan) {
      throw new Error(`未找到用户训练计划：${userPlanId}`);
    }

    return userPlan;
  }

  private getPlanDefinitionOrThrow(workoutPlanId: string): WorkoutPlan {
    const definition = this.availablePlans().find((plan) => plan.id === workoutPlanId);
    if (!definition) {
      throw new Error(`未找到训练计划定义：${workoutPlanId}`);
    }

    return definition;
  }

  private buildParams(query: Record<string, string | number | boolean>): HttpParams {
    return Object.entries(query).reduce(
      (params, [key, value]) => params.set(key, String(value)),
      new HttpParams(),
    );
  }

  private buildSyncParams(updatedAfter: string | null): HttpParams {
    const query: Record<string, string | number | boolean> = {
      limit: 200,
    };

    if (updatedAfter) {
      query['updatedAfter'] = updatedAfter;
    }

    return this.buildParams(query);
  }

  private mergeById<T extends { id: string }>(existing: T[], incoming: T[]): T[] {
    const merged = new Map(existing.map((item) => [item.id, item] as const));

    for (const item of incoming) {
      merged.set(item.id, item);
    }

    return Array.from(merged.values());
  }

  private normalizePlanDefinitions(definitions: WorkoutPlan[]): WorkoutPlan[] {
    return definitions.map((definition) => ({
      ...definition,
      trainingDays: this.workoutService.flattenPlan(definition),
    }));
  }

  private resolveNextCursor<T extends { updatedAt?: string }>(
    currentCursor: string | null,
    resources: T[],
  ): string | null {
    let cursor = currentCursor;

    for (const resource of resources) {
      if (!resource.updatedAt) {
        continue;
      }

      if (!cursor || new Date(resource.updatedAt).getTime() > new Date(cursor).getTime()) {
        cursor = resource.updatedAt;
      }
    }

    return cursor;
  }

  private async recoverFromSubmitConflict(userPlanId: string): Promise<boolean> {
    try {
      await this.refreshDashboardData({
        forceFullSync: true,
      });
      return this.hasAvailableSession(userPlanId);
    } catch (error) {
      console.error('Failed to recover workout state after submit conflict:', error);
      return false;
    }
  }

  private hasAvailableSession(userPlanId: string): boolean {
    const userPlan = this._userPlans().find((plan) => plan.id === userPlanId);
    if (!userPlan || userPlan.status !== 'active') {
      return false;
    }

    const definition = this.availablePlans().find((plan) => plan.id === userPlan.workoutPlanId);
    if (!definition) {
      return false;
    }

    const trainingDays = this.workoutService.flattenPlan(definition);
    return trainingDays[userPlan.currentDayIndex] !== undefined;
  }

  private resolveConflictMessage(
    conflict: Required<Pick<WorkoutConflictPayload, 'code' | 'recoveryAction'>> & {
      message: string;
    },
    sessionAvailableAfterSync: boolean,
  ): string {
    if (sessionAvailableAfterSync && conflict.recoveryAction === 'refresh_session') {
      switch (conflict.code) {
        case 'user_plan_day_advanced':
          return '另一端已经推进了这次训练，当前页面已切到最新训练日。请按最新正式状态继续。';
        case 'training_day_mismatch':
          return '当前训练日已变化，页面已同步到服务端最新正式状态。请按最新训练日继续。';
        case 'plan_commit_boundary_changed':
          return '计划边界已变化，页面已同步到最新正式状态。请按当前训练日继续。';
        default:
          return `${conflict.message} 已同步最新正式数据，请按当前正式状态继续。`;
      }
    }

    switch (conflict.code) {
      case 'user_plan_inactive':
        return '该计划已不再处于激活状态，请返回仪表盘确认最新计划。';
      case 'client_request_reused':
        return '这次提交请求已经绑定到另一条正式记录，请返回仪表盘确认最新状态。';
      case 'user_plan_out_of_range':
        return '当前训练计划已经越界或结束，请返回仪表盘确认最新状态。';
      default:
        return `${conflict.message} 已同步最新正式数据，请确认是否仍需继续训练。`;
    }
  }

  private parseWorkoutConflict(payload: unknown): Required<Pick<WorkoutConflictPayload, 'code' | 'recoveryAction'>> & {
    message: string;
  } {
    const fallback = {
      code: 'training_day_mismatch' as WorkoutConflictCode,
      recoveryAction: 'refresh_session' as WorkoutConflictRecoveryAction,
      message: '服务端正式数据已变化，当前训练状态已失效。',
    };

    if (typeof payload !== 'object' || payload === null) {
      return fallback;
    }

    const conflictPayload = payload as WorkoutConflictPayload;
    const message = this.extractHttpMessage(payload) ?? fallback.message;

    return {
      code: conflictPayload.code ?? fallback.code,
      recoveryAction: conflictPayload.recoveryAction ?? fallback.recoveryAction,
      message,
    };
  }

  private resolveSyncErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return '无法连接服务端，已保留当前正式数据快照，请稍后重试同步。';
      }

      if (error.status === 401) {
        return '登录已失效，请重新登录后再同步正式数据。';
      }

      if (error.status === 409) {
        return '服务端正式数据已变化，请重新同步以获取最新状态。';
      }
    }

    return this.toErrorMessage(error, '正式数据同步失败');
  }

  private toErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const message = this.extractHttpMessage(error.error);
      return message ?? fallback;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  }

  private extractHttpMessage(payload: unknown): string | null {
    if (typeof payload === 'string' && payload.trim().length > 0) {
      return payload;
    }

    if (
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload
    ) {
      const message = payload.message;
      if (typeof message === 'string') {
        return message;
      }

      if (Array.isArray(message)) {
        return message.filter((item): item is string => typeof item === 'string').join('；');
      }
    }

    return null;
  }
}
