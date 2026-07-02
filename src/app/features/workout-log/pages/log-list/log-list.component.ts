import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserPlanCompletionSummary } from '@oven/core';
import { WorkoutLogService } from '../../data-access/workout-log.service';
import {
  WorkoutStatisticsService,
  ChartData,
  ExerciseTrendView,
} from '../../services/workout-statistics.service';
import { VolumeChartComponent } from '../../components/volume-chart/volume-chart.component';
import { ExerciseTrendListComponent } from '../../components/exercise-trend-list/exercise-trend-list.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../auth/auth.service';

@Component({
  selector: 'app-log-list',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTabsModule,
    MatTooltipModule,
    VolumeChartComponent,
    ExerciseTrendListComponent,
  ],
  templateUrl: './log-list.component.html',
  styleUrls: ['./log-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogListComponent {
  protected readonly workoutLogService = inject(WorkoutLogService);
  protected readonly authService = inject(AuthService);
  private readonly statisticsService = inject(WorkoutStatisticsService);
  private readonly router = inject(Router);

  protected readonly historyFilter = signal<'all' | 'completed' | 'interrupted'>('all');
  protected readonly weeklyVolume = computed<ChartData[]>(() =>
    this.statisticsService.getChartData(this.workoutLogService.weeklyVolume()),
  );
  protected readonly monthlyVolume = computed<ChartData[]>(() =>
    this.statisticsService.getChartData(this.workoutLogService.monthlyVolume()),
  );
  protected readonly planCompletionSummary = computed<UserPlanCompletionSummary | null>(() =>
    this.workoutLogService.planCompletionSummary(),
  );
  protected readonly exerciseTrendViews = computed<ExerciseTrendView[]>(() =>
    this.statisticsService.getExerciseTrendViews(
      this.workoutLogService.exerciseTrendSummary(),
      this.workoutLogService.availablePlans(),
    ),
  );
  protected readonly syncStatus = computed(() => this.workoutLogService.syncStatus());
  protected readonly lastSyncedAt = computed(() => this.workoutLogService.lastSyncedAt());
  protected readonly syncError = computed(() => this.workoutLogService.syncError());

  protected async syncNow(): Promise<void> {
    await this.workoutLogService.syncNow();
  }

  protected async resumePlan(userPlanId: string) {
    if (confirm('确定要恢复这个计划吗？当前的活跃计划将会被中断。')) {
      await this.workoutLogService.resumePlan(userPlanId);
    }
  }

  protected async restartPlan(planId: string) {
    if (confirm('确定要重新开始这个计划吗？')) {
      await this.workoutLogService.startExistingPlan(planId);
    }
  }

  protected async archivePlan(userPlanId: string) {
    if (confirm('确定要删除这条历史记录吗？删除后将无法恢复。')) {
      await this.workoutLogService.archivePlan(userPlanId);
    }
  }

  protected async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/auth/login']);
  }

  protected readonly filteredHistoryPlans = computed(() => {
    const plans = this.workoutLogService.historyPlans();
    const filter = this.historyFilter();
    if (filter === 'all') {
      return plans;
    }

    return plans.filter(p => p.status === filter);
  });
}
