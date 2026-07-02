import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, debounceTime } from 'rxjs';
import { WorkoutDataConflictError, WorkoutLogService } from '../../data-access/workout-log.service';
import {
  WorkoutSessionDraftService,
  WorkoutSessionDraft,
  WorkoutSessionDraftExercise,
} from '../../services/workout-session-draft.service';
import { RestTimerService } from '../../services/rest-timer';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CompletedExerciseLog, Exercise, WorkoutLog } from '@oven/core';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface WorkoutExerciseFormValue {
  exerciseId: string;
  sets: Array<{
    reps: number;
    weight: number;
    completed: boolean;
  }>;
}

@Component({
  selector: 'app-workout-session',
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
  ],
  templateUrl: './workout-session.component.html',
  styleUrl: './workout-session.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutSessionComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly workoutLogService = inject(WorkoutLogService);
  private readonly workoutSessionDraftService = inject(WorkoutSessionDraftService);
  private readonly restTimerService = inject(RestTimerService);
  private readonly fb = inject(FormBuilder);

  private readonly userPlanId$ = this.route.paramMap.pipe(
    map(params => params.get('userPlanId'))
  );
  protected readonly userPlanId = toSignal(this.userPlanId$);
  protected readonly todaysWorkout = this.workoutLogService.getTodaysWorkout(this.userPlanId);

  protected readonly form = this.fb.group({
    exercises: this.fb.array([]),
  });

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly conflictNotice = signal<string | null>(null);
  protected readonly historyLogs = signal<Record<string, WorkoutLog>>({});
  protected readonly restoredDraftUpdatedAt = signal<number | null>(null);
  protected readonly conflictDraftUpdatedAt = signal<number | null>(null);
  protected readonly unavailableMessage = signal<string | null>(null);
  private readonly pendingCommit = signal<{ requestId: string; status: WorkoutLog['status'] } | null>(null);
  protected readonly syncStatus = computed(() => this.workoutLogService.syncStatus());
  protected readonly syncError = computed(() => this.workoutLogService.syncError());
  protected readonly lastSyncedAt = computed(() => this.workoutLogService.lastSyncedAt());

  constructor() {
    effect(() => {
      const workout = this.todaysWorkout();
      if (workout) {
        this.unavailableMessage.set(null);
        void this.initializeSession(
          workout.exercises,
          workout.currentDayIndex,
          workout.trainingDayId,
        );
      }
    });

    this.form.valueChanges.pipe(
      debounceTime(1000),
      takeUntilDestroyed(),
    ).subscribe(() => {
      const userPlanId = this.userPlanId();
      const workout = this.todaysWorkout();
      const draftExercises = this.readDraftExercises();

      this.pendingCommit.set(null);
      this.conflictNotice.set(null);

      if (userPlanId && workout && draftExercises) {
        this.workoutSessionDraftService.saveDraft(
          {
            userPlanId,
            trainingDayId: workout.trainingDayId,
            dayIndex: workout.currentDayIndex,
            exercises: draftExercises,
          },
        );
      }
    });
  }

  private async initializeSession(
    exercises: Exercise[],
    currentDayIndex: number,
    trainingDayId: string,
  ): Promise<void> {
    const userPlanId = this.userPlanId();
    let draft: WorkoutSessionDraft | null = null;

    this.pendingCommit.set(null);
    this.conflictDraftUpdatedAt.set(null);

    if (userPlanId) {
      const loadedDraft = this.workoutSessionDraftService.getDraft(userPlanId);
      if (
        loadedDraft &&
        loadedDraft.dayIndex === currentDayIndex &&
        loadedDraft.trainingDayId === trainingDayId
      ) {
        draft = loadedDraft;
        this.restoredDraftUpdatedAt.set(loadedDraft.updatedAt);
      } else if (loadedDraft) {
        this.workoutSessionDraftService.saveConflictDraft(loadedDraft);
        this.workoutSessionDraftService.clearDraft(userPlanId);
        this.conflictDraftUpdatedAt.set(loadedDraft.updatedAt);
        this.restoredDraftUpdatedAt.set(null);
      }
    }

    if (!draft) {
      this.restoredDraftUpdatedAt.set(null);
    }

    this.initForm(exercises, draft);
    await this.loadHistory(exercises);
  }

  private async loadHistory(exercises: Exercise[]): Promise<void> {
    const logs = await Promise.all(
      exercises.map(async (exercise) => ({
        exerciseId: exercise.id,
        log: await this.workoutLogService.getLastExerciseLog(exercise.id),
      })),
    );

    const history = logs.reduce<Record<string, WorkoutLog>>((accumulator, item) => {
      if (item.log) {
        accumulator[item.exerciseId] = item.log;
      }

      return accumulator;
    }, {});

    this.historyLogs.set(history);
  }

  get exercises() {
    return this.form.get('exercises') as FormArray;
  }

  private initForm(exercises: Exercise[], draft?: WorkoutSessionDraft | null): void {
    this.exercises.clear();
    exercises.forEach((exercise) => {
      const draftExercise = draft?.exercises.find((item) => item.exerciseId === exercise.id);

      const setsArray = this.fb.array([] as FormGroup[]);
      for (let index = 0; index < exercise.sets; index++) {
        const draftSet = draftExercise?.sets[index];
        setsArray.push(this.fb.group({
          reps: [draftSet?.reps ?? exercise.reps, [Validators.required, Validators.min(1)]],
          weight: [draftSet?.weight ?? 0, [Validators.required, Validators.min(0)]],
          completed: [draftSet?.completed ?? false],
        }) as FormGroup);
      }

      this.exercises.push(this.fb.group({
        exerciseId: [exercise.id],
        name: [exercise.name],
        suggestedSets: [exercise.sets],
        suggestedReps: [exercise.reps],
        sets: setsArray,
      }));
    });
  }

  getSets(exerciseIndex: number) {
    return this.exercises.at(exerciseIndex).get('sets') as FormArray;
  }

  onSetCompleted(completed: boolean) {
    if (completed) {
      this.restTimerService.start(90); // Default 90 seconds
    }
  }

  getHistoryText(exerciseId: string): string {
    const log = this.historyLogs()[exerciseId];
    if (!log) {
      return '暂无历史记录';
    }

    const exLog = log.completedExercises.find((exercise) => exercise.exerciseId === exerciseId);
    if (!exLog) {
      return '暂无历史记录';
    }

    const setsText = exLog.weight.map((weight, index) => `${weight}kg x ${exLog.reps[index]}`).join(', ');
    const date = new Date(log.date).toLocaleDateString();
    return `上次 (${date}): ${setsText}`;
  }

  protected hasRestoredDraft(): boolean {
    return this.restoredDraftUpdatedAt() !== null;
  }

  protected getDraftRestoredText(): string {
    const updatedAt = this.restoredDraftUpdatedAt();
    if (updatedAt === null) {
      return '';
    }

    return `已恢复本地草稿，最近保存于 ${new Date(updatedAt).toLocaleString()}`;
  }

  protected canSubmitCompletedWorkout(): boolean {
    if (this.form.invalid) {
      return false;
    }

    return this.buildCompletedExercises().length > 0;
  }

  protected hasConflictNotice(): boolean {
    return this.conflictNotice() !== null;
  }

  protected getConflictNoticeText(): string {
    const notice = this.conflictNotice();
    const conflictDraftUpdatedAt = this.conflictDraftUpdatedAt();
    if (!notice) {
      return '';
    }

    if (conflictDraftUpdatedAt === null) {
      return notice;
    }

    return `${notice} 旧输入草稿已转存为本机冲突备份（${new Date(conflictDraftUpdatedAt).toLocaleString()}）。`;
  }

  protected isSessionBootstrapping(): boolean {
    return this.todaysWorkout() === null && this.syncStatus() === 'syncing' && this.lastSyncedAt() === null;
  }

  protected getSessionUnavailableMessage(): string {
    return (
      this.unavailableMessage() ??
      this.syncError() ??
      '当前训练状态已变化，已同步最新正式数据，请返回仪表盘确认。'
    );
  }

  private readDraftExercises(): WorkoutSessionDraftExercise[] | null {
    const rawValue = this.form.getRawValue();
    if (!Array.isArray(rawValue.exercises)) {
      return null;
    }

    const exercises = rawValue.exercises as WorkoutExerciseFormValue[];

    return exercises.map((exercise) => ({
      exerciseId: exercise.exerciseId,
      sets: exercise.sets.map((set) => ({
        reps: set.reps,
        weight: set.weight,
        completed: set.completed,
      })),
    }));
  }

  private buildCompletedExercises(): CompletedExerciseLog[] {
    const rawValue = this.form.getRawValue();
    if (!Array.isArray(rawValue.exercises)) {
      return [];
    }

    const exercises = rawValue.exercises as WorkoutExerciseFormValue[];

    return exercises
      .map((exercise) => {
        const completedSets = exercise.sets.filter((set) => set.completed);

        return {
          exerciseId: exercise.exerciseId,
          sets: completedSets.length,
          reps: completedSets.map((set) => set.reps),
          weight: completedSets.map((set) => set.weight),
        };
      })
      .filter((exercise) => exercise.sets > 0);
  }

  private async submitSession(status: WorkoutLog['status']): Promise<void> {
    const id = this.userPlanId();
    if (!id) {
      return;
    }

    this.errorMessage.set(null);
    this.conflictNotice.set(null);

    const completedExercises = status === 'completed' ? this.buildCompletedExercises() : [];
    if (status === 'completed') {
      if (this.form.invalid) {
        return;
      }

      if (completedExercises.length === 0) {
        this.errorMessage.set('至少勾选一组已完成内容后，才能写入正式训练记录。');
        return;
      }
    }

    this.isSubmitting.set(true);
    try {
      const clientRequestId = this.getOrCreateCommitRequestId(status);
      await this.workoutLogService.submitWorkoutSession(
        id,
        status,
        completedExercises,
        clientRequestId,
      );
      this.pendingCommit.set(null);
      this.workoutSessionDraftService.clearDraft(id);
      this.workoutSessionDraftService.clearConflictDraft(id);
      this.restoredDraftUpdatedAt.set(null);
      this.conflictDraftUpdatedAt.set(null);
      this.router.navigate(['/workout-log']);
    } catch (error) {
      if (error instanceof WorkoutDataConflictError) {
        this.pendingCommit.set(null);
        if (error.sessionAvailableAfterSync) {
          this.unavailableMessage.set(null);
          this.conflictNotice.set(error.message);
          this.errorMessage.set(null);
          return;
        }

        this.unavailableMessage.set(error.message);
        this.conflictNotice.set(null);
        this.errorMessage.set(null);
        return;
      }

      this.errorMessage.set(error instanceof Error ? error.message : '训练提交失败，请稍后重试。');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async onSubmit() {
    await this.submitSession('completed');
  }

  async onSkip() {
    if (!confirm('确定要跳过今天的训练吗？')) {
      return;
    }

    await this.submitSession('skipped');
  }

  protected async refreshSessionState(): Promise<void> {
    this.unavailableMessage.set(null);
    this.conflictNotice.set(null);
    await this.workoutLogService.syncNow({
      forceFullSync: true,
    });
  }

  protected async goBackToDashboard(): Promise<void> {
    await this.router.navigate(['/workout-log']);
  }

  private getOrCreateCommitRequestId(status: WorkoutLog['status']): string {
    const pendingCommit = this.pendingCommit();
    if (pendingCommit && pendingCommit.status === status) {
      return pendingCommit.requestId;
    }

    const requestId =
      globalThis.crypto?.randomUUID() ??
      `commit-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    this.pendingCommit.set({
      requestId,
      status,
    });

    return requestId;
  }
}
