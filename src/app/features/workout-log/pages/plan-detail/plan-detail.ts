import { CommonModule, Location } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WorkoutLogService } from '../../data-access/workout-log.service';
import { ScheduleItem, WorkoutPlan } from '@oven/core';
import { ScheduleList } from '../plan-create/components/schedule-list/schedule-list';

@Component({
  selector: 'app-plan-detail',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, ScheduleList],
  template: `
    <div class="min-h-screen bg-slate-50 pb-24">
      @if (plan(); as currentPlan) {
        <!-- Header -->
        <div class="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div class="mx-auto flex min-h-16 max-w-5xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div class="flex min-w-0 items-center gap-3 sm:gap-4">
              <button mat-icon-button (click)="goBack()">
                <mat-icon>arrow_back</mat-icon>
              </button>
              <h1 class="truncate text-lg font-bold text-slate-900 sm:text-xl">{{ currentPlan.name }}</h1>
            </div>
            <button mat-flat-button color="primary" (click)="startPlan(currentPlan)" class="!rounded-lg w-full sm:w-auto">
              <mat-icon class="mr-2">play_arrow</mat-icon>
              开始此计划
            </button>
          </div>
        </div>

        <main class="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6 sm:py-8">
          <!-- Description Card -->
          <div class="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm sm:p-8">
            <h2 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <mat-icon class="text-indigo-500">info</mat-icon>
              计划简介
            </h2>
            <p class="text-slate-600 leading-relaxed whitespace-pre-line">{{ currentPlan.description }}</p>
          </div>

          <!-- Schedule Preview -->
          <div class="space-y-6">
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
              <mat-icon class="text-indigo-500">calendar_today</mat-icon>
              训练日程预览
            </h2>

            <!-- Reusing ScheduleList in readonly mode -->
            <app-schedule-list [formArray]="formArray" [readonly]="true"></app-schedule-list>
          </div>
        </main>
      } @else {
        <div class="flex justify-center items-center min-h-[50vh]">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      }
    </div>
  `,
  styles: ``
})
export class PlanDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly workoutLogService = inject(WorkoutLogService);
  private readonly fb = inject(FormBuilder);

  readonly planId = signal<string | null>(null);
  readonly plan = computed(() => {
    const id = this.planId();
    if (!id) return null;
    return this.workoutLogService.availablePlans().find(p => p.id === id) || null;
  });

  readonly formArray: FormArray<FormGroup> = this.fb.array<FormGroup>([]);

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.planId.set(params.get('planId'));
    });

    effect(() => {
      const currentPlan = this.plan();
      this.formArray.clear();
      if (currentPlan) {
        this.populateFormArray(currentPlan);
      }
    });
  }

  private populateFormArray(plan: WorkoutPlan): void {
    this.formArray.clear();

    const items: ScheduleItem[] = plan.schedule?.length
      ? plan.schedule
      : plan.trainingDays?.length
        ? plan.trainingDays
        : [];

    items.forEach(item => {
      this.formArray.push(this.createGroupFromItem(item));
    });
  }

  private createGroupFromItem(item: ScheduleItem): FormGroup {
    if ('type' in item && item.type === 'cycle') {
      const itemsArray = this.fb.array<FormGroup>([]);
      item.items.forEach(subItem => itemsArray.push(this.createGroupFromItem(subItem)));

      return this.fb.group({
        type: ['cycle'],
        name: [item.name],
        repeats: [item.repeats],
        items: itemsArray
      });
    }

    const exercisesArray = this.fb.array<FormGroup>(
      item.exercises.map(exercise =>
        this.fb.group({
          name: [exercise.name],
          sets: [exercise.sets],
          reps: [exercise.reps]
        }),
      ),
    );

    return this.fb.group({
      type: [item.type],
      name: [item.name],
      exercises: exercisesArray
    });
  }

  async startPlan(plan: WorkoutPlan): Promise<void> {
    await this.workoutLogService.startExistingPlan(plan.id);
    await this.router.navigate(['/workout-log']);
  }

  goBack(): void {
    this.location.back();
  }
}
