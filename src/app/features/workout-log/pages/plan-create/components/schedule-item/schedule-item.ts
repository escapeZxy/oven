import { Component, EventEmitter, Input, Output, inject, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ScheduleList } from '../schedule-list/schedule-list';

@Component({
  selector: 'app-schedule-item',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    forwardRef(() => ScheduleList),
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <div [formGroup]="formGroup" class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <!-- Item Header -->
      <div class="bg-slate-50/50 p-4 border-b border-slate-100 flex items-start md:items-center justify-between gap-4 flex-col md:flex-row">
        <div class="flex items-center gap-3 flex-1 w-full">
          <!-- Type Badge -->
          <div class="h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm"
               [class.bg-purple-100]="isCycle"
               [class.text-purple-600]="isCycle"
               [class.bg-emerald-100]="isRestDay"
               [class.text-emerald-600]="isRestDay"
               [class.bg-indigo-100]="!isCycle && !isRestDay"
               [class.text-indigo-600]="!isCycle && !isRestDay">
            <mat-icon class="!w-5 !h-5 !text-xl">{{ itemIcon }}</mat-icon>
          </div>

          <!-- Name Input -->
          <mat-form-field appearance="outline" class="flex-1 !mb-[-1.25em]">
            <mat-label>{{ itemLabel }}</mat-label>
            <input matInput formControlName="name" placeholder="例如：{{ itemPlaceholder }}" [readonly]="readonly" />
          </mat-form-field>

          <!-- Cycle Repeats Input -->
          @if (isCycle) {
            <mat-form-field appearance="outline" class="w-32 !mb-[-1.25em]">
              <mat-label>重复次数</mat-label>
              <input matInput type="number" formControlName="repeats" min="1" [readonly]="readonly" />
              <span matTextSuffix>次</span>
            </mat-form-field>
          }
        </div>

        @if (!readonly) {
          <button mat-icon-button color="warn" type="button" (click)="remove.emit()" matTooltip="删除">
            <mat-icon>delete_outline</mat-icon>
          </button>
        }
      </div>

      <!-- Item Content -->
      <div class="p-4">
        @if (isCycle) {
          <!-- Recursive List for Cycle -->
          <div class="pl-4 border-l-2 border-purple-100">
            <app-schedule-list [formArray]="itemsArray" [readonly]="readonly"></app-schedule-list>
          </div>
        } @else if (isRestDay) {
          <div class="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4 text-sm leading-6 text-emerald-800">
            休息日不会配置训练动作。执行计划时，这一天会以“完成休息日”的方式推进到下一天。
          </div>
        } @else {
          <!-- Exercises List for Day -->
          <div formArrayName="exercises" class="space-y-4">
            @for (exercise of exercisesArray.controls; track $index; let j = $index) {
              <div [formGroupName]="j" class="group relative grid grid-cols-1 md:grid-cols-12 gap-4 items-start p-4 rounded-xl bg-slate-50/50 hover:bg-indigo-50/30 border border-transparent hover:border-indigo-100 transition-all">

                <div class="md:col-span-5">
                  <mat-form-field appearance="outline" class="w-full !mb-[-1.25em]">
                    <mat-label>动作名称</mat-label>
                    <input matInput formControlName="name" placeholder="例如：平板卧推" [readonly]="readonly" />
                  </mat-form-field>
                </div>

                <div class="md:col-span-3">
                  <mat-form-field appearance="outline" class="w-full !mb-[-1.25em]">
                    <mat-label>建议组数</mat-label>
                    <input matInput type="number" formControlName="sets" min="1" [readonly]="readonly" />
                  </mat-form-field>
                </div>

                <div class="md:col-span-3">
                  <mat-form-field appearance="outline" class="w-full !mb-[-1.25em]">
                    <mat-label>建议次数</mat-label>
                    <input matInput type="number" formControlName="reps" min="1" [readonly]="readonly" />
                  </mat-form-field>
                </div>

                @if (!readonly) {
                  <div class="md:col-span-1 flex justify-end">
                    <button mat-icon-button color="warn" type="button" (click)="removeExercise(j)" class="opacity-0 group-hover:opacity-100 transition-opacity">
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                }
              </div>
            }

            @if (!readonly) {
              <button mat-button color="primary" type="button" (click)="addExercise()">
                <mat-icon>add_circle_outline</mat-icon>
                添加动作
              </button>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: ``
})
export class ScheduleItem {
  @Input({ required: true }) formGroup!: FormGroup;
  @Input() readonly = false; // New input for read-only mode
  @Output() remove = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  get isCycle() {
    return this.formGroup.get('type')?.value === 'cycle';
  }

  get isRestDay() {
    return this.formGroup.get('type')?.value === 'rest';
  }

  get itemIcon(): string {
    if (this.isCycle) {
      return 'repeat';
    }

    if (this.isRestDay) {
      return 'hotel';
    }

    return 'event';
  }

  get itemLabel(): string {
    if (this.isCycle) {
      return '循环名称';
    }

    if (this.isRestDay) {
      return '休息日名称';
    }

    return '训练日名称';
  }

  get itemPlaceholder(): string {
    if (this.isCycle) {
      return '增肌期循环';
    }

    if (this.isRestDay) {
      return '主动恢复日';
    }

    return '胸部和三头肌';
  }

  get itemsArray() {
    return this.formGroup.get('items') as FormArray;
  }

  get exercisesArray() {
    return this.formGroup.get('exercises') as FormArray;
  }

  addExercise(): void {
    if (this.readonly) return;
    this.exercisesArray.push(this.fb.group({
      name: ['', Validators.required],
      sets: [3, [Validators.required, Validators.min(1)]],
      reps: [10, [Validators.required, Validators.min(1)]]
    }));
  }

  removeExercise(index: number): void {
    if (this.readonly) return;
    this.exercisesArray.removeAt(index);
  }
}
