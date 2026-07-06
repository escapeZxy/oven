import { Component, Input, inject, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ScheduleItem } from '../schedule-item/schedule-item';
import { createPlanNodeId } from '../../plan-node-id';

@Component({
  selector: 'app-schedule-list',
  standalone: true,
  imports: [CommonModule, forwardRef(() => ScheduleItem), MatButtonModule, MatIconModule],
  template: `
    <div class="space-y-4">
      @for (control of formArray.controls; track control) {
        <app-schedule-item 
          [formGroup]="asFormGroup(control)" 
          [readonly]="readonly"
          (remove)="removeItem($index)">
        </app-schedule-item>
      }
      
      @if (!readonly) {
        <div class="flex flex-col gap-2 justify-center rounded-xl border-2 border-dashed border-slate-200 py-4 transition-all hover:border-indigo-200 hover:bg-indigo-50/30 sm:flex-row">
          <button mat-stroked-button color="primary" class="w-full sm:w-auto" (click)="addDay()">
            <mat-icon>add</mat-icon> 添加训练日
          </button>
          <button mat-stroked-button class="w-full sm:w-auto" (click)="addRestDay()">
            <mat-icon>hotel</mat-icon> 添加休息日
          </button>
          <button mat-stroked-button color="accent" class="w-full sm:w-auto" (click)="addCycle()">
            <mat-icon>repeat</mat-icon> 添加循环
          </button>
        </div>
      }
    </div>
  `,
  styles: ``
})
export class ScheduleList {
  @Input({ required: true }) formArray!: FormArray;
  @Input() readonly = false; // New input for read-only mode
  private readonly fb = inject(FormBuilder);

  asFormGroup(control: any): FormGroup {
    return control as FormGroup;
  }

  addDay(): void {
    if (this.readonly) return;
    this.formArray.push(this.fb.group({
      id: [createPlanNodeId('day')],
      type: ['day'],
      name: ['训练日', Validators.required],
      exercises: this.fb.array([])
    }));
  }

  addRestDay(): void {
    if (this.readonly) return;
    this.formArray.push(this.fb.group({
      id: [createPlanNodeId('day')],
      type: ['rest'],
      name: ['休息日', Validators.required],
      exercises: this.fb.array([]),
    }));
  }

  addCycle(): void {
    if (this.readonly) return;
    this.formArray.push(this.fb.group({
      id: [createPlanNodeId('cycle')],
      type: ['cycle'],
      name: ['循环周期', Validators.required],
      repeats: [4, [Validators.required, Validators.min(1)]],
      items: this.fb.array([])
    }));
  }

  removeItem(index: number): void {
    if (this.readonly) return;
    this.formArray.removeAt(index);
  }
}
