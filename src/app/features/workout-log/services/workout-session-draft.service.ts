import { Injectable, inject } from '@angular/core';

export interface WorkoutSessionDraftSet {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutSessionDraftExercise {
  exerciseId: string;
  sets: WorkoutSessionDraftSet[];
}

export interface WorkoutSessionDraft {
  userPlanId: string;
  trainingDayId: string;
  dayIndex: number;
  exercises: WorkoutSessionDraftExercise[];
  updatedAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutSessionDraftService {
  private readonly STORAGE_KEY_PREFIX = 'workout_draft_';
  private readonly CONFLICT_STORAGE_KEY_PREFIX = 'workout_conflict_draft_';

  saveDraft(
    draft: Omit<WorkoutSessionDraft, 'updatedAt'>,
  ): void {
    const persistedDraft: WorkoutSessionDraft = {
      ...draft,
      updatedAt: Date.now(),
    };

    localStorage.setItem(this.getKey(draft.userPlanId), JSON.stringify(persistedDraft));
  }

  getDraft(userPlanId: string): WorkoutSessionDraft | null {
    const data = localStorage.getItem(this.getKey(userPlanId));
    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data) as WorkoutSessionDraft;
    } catch (error: unknown) {
      console.error('Failed to parse workout draft', error);
      this.clearDraft(userPlanId);
      return null;
    }
  }

  clearDraft(userPlanId: string): void {
    localStorage.removeItem(this.getKey(userPlanId));
  }

  saveConflictDraft(draft: WorkoutSessionDraft): void {
    localStorage.setItem(this.getConflictKey(draft.userPlanId), JSON.stringify(draft));
  }

  getConflictDraft(userPlanId: string): WorkoutSessionDraft | null {
    const data = localStorage.getItem(this.getConflictKey(userPlanId));
    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data) as WorkoutSessionDraft;
    } catch (error: unknown) {
      console.error('Failed to parse conflict workout draft', error);
      this.clearConflictDraft(userPlanId);
      return null;
    }
  }

  clearConflictDraft(userPlanId: string): void {
    localStorage.removeItem(this.getConflictKey(userPlanId));
  }

  private getKey(userPlanId: string): string {
    return `${this.STORAGE_KEY_PREFIX}${userPlanId}`;
  }

  private getConflictKey(userPlanId: string): string {
    return `${this.CONFLICT_STORAGE_KEY_PREFIX}${userPlanId}`;
  }
}
