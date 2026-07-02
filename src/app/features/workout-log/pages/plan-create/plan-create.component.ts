import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WorkoutLogService } from '../../data-access/workout-log.service';
import { WorkoutPlan } from '@oven/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ScheduleList } from './components/schedule-list/schedule-list';

@Component({
  selector: 'app-plan-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ScheduleList,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './plan-create.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanCreateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly workoutLogService = inject(WorkoutLogService);
  private readonly location = inject(Location);

  protected readonly form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    schedule: this.fb.array([])
  });

  get schedule(): FormArray {
    return this.form.get('schedule') as FormArray;
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }
    // We cast to any because the form structure matches the new WorkoutPlan structure
    // but TS might complain about optional fields or strict types
    await this.workoutLogService.createPlan(this.form.value as unknown as Omit<WorkoutPlan, 'id'>);
    await this.router.navigate(['/workout-log']);
  }

  cancel(): void {
    this.location.back();
  }
}
