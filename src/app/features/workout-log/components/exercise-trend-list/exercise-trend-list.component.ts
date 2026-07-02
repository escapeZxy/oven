import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ExerciseTrendView, WorkoutStatisticsService } from '../../services/workout-statistics.service';

@Component({
  selector: 'app-exercise-trend-list',
  imports: [CommonModule, MatIconModule],
  template: `
    @if (items().length > 0) {
      <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
        @for (item of items(); track item.exerciseId) {
          <article class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-1">
                <p class="text-lg font-bold text-slate-900">{{ item.exerciseName }}</p>
                <p class="text-xs text-slate-500">
                  最近 {{ item.sessionCount }} 次正式记录，最新训练 {{ item.latestLogAt | date:'shortDate' }}
                </p>
              </div>
              <div
                class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                [class.bg-emerald-50]="item.direction === 'up'"
                [class.text-emerald-700]="item.direction === 'up'"
                [class.bg-rose-50]="item.direction === 'down'"
                [class.text-rose-700]="item.direction === 'down'"
                [class.bg-slate-100]="item.direction === 'stable' || item.direction === 'new'"
                [class.text-slate-600]="item.direction === 'stable' || item.direction === 'new'">
                <mat-icon class="!h-4 !w-4 !text-base">{{ getDirectionIcon(item.direction) }}</mat-icon>
                {{ getDirectionLabel(item.direction) }}
              </div>
            </div>

            <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div class="rounded-2xl bg-slate-50 px-4 py-3">
                <p class="text-xs font-medium text-slate-500">最新容量</p>
                <p class="mt-1 text-2xl font-bold text-slate-900">{{ item.latestVolume | number:'1.0-0' }} kg</p>
              </div>
              <div class="rounded-2xl bg-slate-50 px-4 py-3">
                <p class="text-xs font-medium text-slate-500">上次容量</p>
                <p class="mt-1 text-2xl font-bold text-slate-900">
                  @if (item.previousVolume !== null) {
                    {{ item.previousVolume | number:'1.0-0' }} kg
                  } @else {
                    --
                  }
                </p>
              </div>
              <div class="rounded-2xl bg-slate-50 px-4 py-3">
                <p class="text-xs font-medium text-slate-500">变化</p>
                <p class="mt-1 text-2xl font-bold"
                  [class.text-emerald-700]="item.changeVolume !== null && item.changeVolume > 0"
                  [class.text-rose-700]="item.changeVolume !== null && item.changeVolume < 0"
                  [class.text-slate-900]="item.changeVolume === null || item.changeVolume === 0">
                  {{ formatChange(item) }}
                </p>
              </div>
            </div>

            <div class="mt-5 space-y-2">
              <div class="flex items-end justify-between gap-2 border-b border-slate-200 pb-2">
                @for (point of item.points; track point.label) {
                  <div class="flex flex-1 flex-col items-center gap-2">
                    <div class="flex h-20 w-full items-end justify-center">
                      <div
                        class="w-full max-w-[28px] rounded-t-md bg-indigo-500/80"
                        [style.height.%]="getPointPercentage(item.points, point.value)">
                      </div>
                    </div>
                    <div class="text-[10px] font-medium text-slate-400">{{ point.label }}</div>
                  </div>
                }
              </div>
            </div>
          </article>
        }
      </div>
    } @else {
      <div class="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-500">
        暂无可用的动作趋势统计
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseTrendListComponent {
  protected readonly statisticsService = inject(WorkoutStatisticsService);
  public readonly items = input.required<ExerciseTrendView[]>();

  protected getPointPercentage(points: ExerciseTrendView['points'], value: number): number {
    return (value / this.statisticsService.getMaxValue(points)) * 100;
  }

  protected getDirectionIcon(direction: ExerciseTrendView['direction']): string {
    switch (direction) {
      case 'up':
        return 'trending_up';
      case 'down':
        return 'trending_down';
      case 'stable':
        return 'trending_flat';
      default:
        return 'fiber_new';
    }
  }

  protected getDirectionLabel(direction: ExerciseTrendView['direction']): string {
    switch (direction) {
      case 'up':
        return '上升';
      case 'down':
        return '下降';
      case 'stable':
        return '持平';
      default:
        return '新动作';
    }
  }

  protected formatChange(item: ExerciseTrendView): string {
    if (item.changeVolume === null || item.changeRate === null) {
      return '--';
    }

    const sign = item.changeVolume > 0 ? '+' : '';
    return `${sign}${item.changeVolume.toFixed(0)} kg / ${sign}${item.changeRate.toFixed(0)}%`;
  }
}
