import { Exercise, ScheduleItem, TrainingCycle, TrainingDay, WorkoutPlan } from '@oven/core';

type ScheduleDraft = Partial<ScheduleItem> & Record<string, unknown>;
type DayDraft = Partial<TrainingDay> & Record<string, unknown>;
type CycleDraft = Partial<TrainingCycle> & Record<string, unknown>;
type ExerciseDraft = Partial<Exercise> & Record<string, unknown>;

export function createPlanNodeId(prefix: 'cycle' | 'day' | 'exercise'): string {
  const randomPart =
    globalThis.crypto?.randomUUID() ??
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return `${prefix}-${randomPart}`;
}

function isCycleDraft(item: ScheduleDraft): item is CycleDraft {
  return item.type === 'cycle';
}

function normalizeExercise(dayId: string, exercise: ExerciseDraft): Exercise {
  return {
    id: typeof exercise.id === 'string' && exercise.id.length > 0
      ? exercise.id
      : createPlanNodeId('exercise'),
    name: typeof exercise.name === 'string' ? exercise.name : '',
    sets: typeof exercise.sets === 'number' ? exercise.sets : 0,
    reps: typeof exercise.reps === 'number' ? exercise.reps : 0,
  };
}

function normalizePersistedExercise(
  dayId: string,
  exercise: ExerciseDraft,
  index: number,
): Exercise {
  return {
    id:
      typeof exercise.id === 'string' && exercise.id.length > 0
        ? exercise.id
        : `${dayId}:exercise:${index}`,
    name: typeof exercise.name === 'string' ? exercise.name : '',
    sets: typeof exercise.sets === 'number' ? exercise.sets : 0,
    reps: typeof exercise.reps === 'number' ? exercise.reps : 0,
  };
}

function normalizeTrainingDay(day: DayDraft): TrainingDay {
  const dayId =
    typeof day.id === 'string' && day.id.length > 0
      ? day.id
      : createPlanNodeId('day');
  const exercises = Array.isArray(day.exercises) ? day.exercises : [];

  return {
    id: dayId,
    type: (day.type as TrainingDay['type']) ?? 'day',
    name: typeof day.name === 'string' ? day.name : '训练日',
    exercises: exercises.map((exercise) =>
      normalizeExercise(dayId, (exercise ?? {}) as ExerciseDraft),
    ),
  };
}

function normalizeCycle(cycle: CycleDraft): TrainingCycle {
  const items = Array.isArray(cycle.items) ? cycle.items : [];

  return {
    id:
      typeof cycle.id === 'string' && cycle.id.length > 0
        ? cycle.id
        : createPlanNodeId('cycle'),
    type: 'cycle',
    name: typeof cycle.name === 'string' ? cycle.name : '循环周期',
    description: typeof cycle.description === 'string' ? cycle.description : undefined,
    repeats: typeof cycle.repeats === 'number' && cycle.repeats > 0 ? cycle.repeats : 1,
    items: items.map((item) => normalizeScheduleItem((item ?? {}) as ScheduleDraft)),
  };
}

function normalizeScheduleItem(item: ScheduleDraft): ScheduleItem {
  if (isCycleDraft(item)) {
    return normalizeCycle(item);
  }

  return normalizeTrainingDay(item as DayDraft);
}

function normalizePersistedTrainingDay(
  planId: string,
  day: DayDraft,
  path: string,
): TrainingDay {
  const dayId =
    typeof day.id === 'string' && day.id.length > 0
      ? day.id
      : `${planId}:day:${path}`;
  const exercises = Array.isArray(day.exercises) ? day.exercises : [];

  return {
    id: dayId,
    type: (day.type as TrainingDay['type']) ?? 'day',
    name: typeof day.name === 'string' ? day.name : '训练日',
    exercises: exercises.map((exercise, index) =>
      normalizePersistedExercise(dayId, (exercise ?? {}) as ExerciseDraft, index),
    ),
  };
}

function normalizePersistedCycle(
  planId: string,
  cycle: CycleDraft,
  path: string,
): TrainingCycle {
  const items = Array.isArray(cycle.items) ? cycle.items : [];

  return {
    id:
      typeof cycle.id === 'string' && cycle.id.length > 0
        ? cycle.id
        : `${planId}:cycle:${path}`,
    type: 'cycle',
    name: typeof cycle.name === 'string' ? cycle.name : '循环周期',
    description: typeof cycle.description === 'string' ? cycle.description : undefined,
    repeats: typeof cycle.repeats === 'number' && cycle.repeats > 0 ? cycle.repeats : 1,
    items: items.map((item, index) =>
      normalizePersistedScheduleItem(planId, (item ?? {}) as ScheduleDraft, `${path}.${index}`),
    ),
  };
}

function normalizePersistedScheduleItem(
  planId: string,
  item: ScheduleDraft,
  path: string,
): ScheduleItem {
  if (isCycleDraft(item)) {
    return normalizePersistedCycle(planId, item, path);
  }

  return normalizePersistedTrainingDay(planId, item as DayDraft, path);
}

export function normalizePlanDraft(
  plan: Omit<WorkoutPlan, 'id'>,
): Omit<WorkoutPlan, 'id'> {
  return {
    ...plan,
    schedule: Array.isArray(plan.schedule)
      ? plan.schedule.map((item) => normalizeScheduleItem((item ?? {}) as ScheduleDraft))
      : plan.schedule,
    trainingDays: Array.isArray(plan.trainingDays)
      ? plan.trainingDays.map((day) => normalizeTrainingDay((day ?? {}) as DayDraft))
      : plan.trainingDays,
  };
}

export function normalizePersistedPlanDefinition(plan: WorkoutPlan): WorkoutPlan {
  return {
    ...plan,
    schedule: Array.isArray(plan.schedule)
      ? plan.schedule.map((item, index) =>
          normalizePersistedScheduleItem(plan.id, (item ?? {}) as ScheduleDraft, `schedule.${index}`),
        )
      : plan.schedule,
    trainingDays: Array.isArray(plan.trainingDays)
      ? plan.trainingDays.map((day, index) =>
          normalizePersistedTrainingDay(
            plan.id,
            (day ?? {}) as DayDraft,
            `training-days.${index}`,
          ),
        )
      : plan.trainingDays,
  };
}
