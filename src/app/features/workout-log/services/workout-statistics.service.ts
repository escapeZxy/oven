import { Injectable } from '@angular/core';
import {
  ExerciseTrendDirection,
  ExerciseTrendSummary,
  WorkoutPlan,
  WorkoutVolumeSummary,
} from '@oven/core';

export interface ChartData {
  label: string;
  value: number;
}

export interface ExerciseTrendView {
  exerciseId: string;
  exerciseName: string;
  latestLogAt: string;
  latestVolume: number;
  previousVolume: number | null;
  changeVolume: number | null;
  changeRate: number | null;
  direction: ExerciseTrendDirection;
  sessionCount: number;
  points: ChartData[];
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutStatisticsService {
  getChartData(summary: WorkoutVolumeSummary | null): ChartData[] {
    if (!summary) {
      return [];
    }

    return summary.points.map((point) => ({
      label: this.formatLabel(summary.bucket, point.bucketStart),
      value: point.volume,
    }));
  }

  getExerciseTrendViews(
    summary: ExerciseTrendSummary | null,
    plans: WorkoutPlan[],
  ): ExerciseTrendView[] {
    if (!summary) {
      return [];
    }

    return summary.items.map((item) => ({
      exerciseId: item.exerciseId,
      exerciseName: this.resolveExerciseName(plans, item.exerciseId),
      latestLogAt: item.latestLogAt,
      latestVolume: item.latestVolume,
      previousVolume: item.previousVolume,
      changeVolume: item.changeVolume,
      changeRate: item.changeRate,
      direction: item.direction,
      sessionCount: item.sessionCount,
      points: item.points.map((point) => ({
        label: this.formatTrendLabel(point.loggedAt),
        value: point.volume,
      })),
    }));
  }

  getMaxValue(points: ChartData[]): number {
    const max = Math.max(...points.map((point) => point.value), 0);
    return max === 0 ? 1 : max;
  }

  private formatLabel(bucket: WorkoutVolumeSummary['bucket'], bucketStart: string): string {
    const date = new Date(bucketStart);

    if (bucket === 'month') {
      return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}`;
    }

    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
  }

  private formatTrendLabel(loggedAt: string): string {
    const date = new Date(loggedAt);
    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
  }

  private resolveExerciseName(plans: WorkoutPlan[], exerciseId: string): string {
    for (const plan of plans) {
      for (const day of plan.trainingDays ?? []) {
        const exercise = day.exercises.find((item) => item.id === exerciseId);

        if (exercise) {
          return exercise.name;
        }
      }
    }

    return exerciseId;
  }
}
