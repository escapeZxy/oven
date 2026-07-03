import { Exercise, ScheduleItem, TrainingCycle, TrainingDay } from '@oven/core';

interface WorkoutPlanStructure {
  schedule?: ScheduleItem[];
  trainingDays?: TrainingDay[];
}

type ScheduleCandidate = Partial<ScheduleItem> & Record<string, unknown>;
type DayCandidate = Partial<TrainingDay> & Record<string, unknown>;
type CycleCandidate = Partial<TrainingCycle> & Record<string, unknown>;
type ExerciseCandidate = Partial<Exercise> & Record<string, unknown>;

function readNonEmptyString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function readNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function isCycleCandidate(item: ScheduleCandidate): item is CycleCandidate {
  return item.type === 'cycle';
}

function normalizeExercise(
  dayId: string,
  exercise: ExerciseCandidate,
  index: number,
): Exercise {
  return {
    id: readNonEmptyString(exercise.id) ?? `${dayId}:exercise:${index}`,
    name: readNonEmptyString(exercise.name) ?? '',
    sets: readNumber(exercise.sets, 0),
    reps: readNumber(exercise.reps, 0),
  };
}

function normalizeTrainingDay(
  planKey: string,
  day: DayCandidate,
  path: string,
): TrainingDay {
  const dayId = readNonEmptyString(day.id) ?? `${planKey}:day:${path}`;
  const exercises = Array.isArray(day.exercises) ? day.exercises : [];

  return {
    id: dayId,
    type: (day.type as TrainingDay['type']) ?? 'day',
    name: readNonEmptyString(day.name) ?? '训练日',
    exercises: exercises.map((exercise, index) =>
      normalizeExercise(dayId, (exercise ?? {}) as ExerciseCandidate, index),
    ),
  };
}

function normalizeCycle(
  planKey: string,
  cycle: CycleCandidate,
  path: string,
): TrainingCycle {
  const items = Array.isArray(cycle.items) ? cycle.items : [];

  return {
    id: readNonEmptyString(cycle.id) ?? `${planKey}:cycle:${path}`,
    type: 'cycle',
    name: readNonEmptyString(cycle.name) ?? '循环周期',
    description: readNonEmptyString(cycle.description) ?? undefined,
    repeats: Math.max(1, readNumber(cycle.repeats, 1)),
    items: items.map((item, index) =>
      normalizeScheduleItem(planKey, (item ?? {}) as ScheduleCandidate, `${path}.${index}`),
    ),
  };
}

function normalizeScheduleItem(
  planKey: string,
  item: ScheduleCandidate,
  path: string,
): ScheduleItem {
  if (isCycleCandidate(item)) {
    return normalizeCycle(planKey, item, path);
  }

  return normalizeTrainingDay(planKey, item as DayCandidate, path);
}

export function normalizeWorkoutPlanStructure(
  planKey: string,
  plan: WorkoutPlanStructure,
): WorkoutPlanStructure {
  return {
    schedule:
      plan.schedule === undefined
        ? undefined
        : plan.schedule.map((item, index) =>
            normalizeScheduleItem(planKey, (item ?? {}) as ScheduleCandidate, `schedule.${index}`),
          ),
    trainingDays:
      plan.trainingDays === undefined
        ? undefined
        : plan.trainingDays.map((day, index) =>
            normalizeTrainingDay(
              planKey,
              (day ?? {}) as DayCandidate,
              `training-days.${index}`,
            ),
          ),
  };
}
