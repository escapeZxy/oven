"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeWorkoutPlanStructure = normalizeWorkoutPlanStructure;
function readNonEmptyString(value) {
    return typeof value === 'string' && value.trim().length > 0 ? value : null;
}
function readNumber(value, fallback) {
    return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}
function isCycleCandidate(item) {
    return item.type === 'cycle';
}
function normalizeExercise(dayId, exercise, index) {
    var _a, _b;
    return {
        id: (_a = readNonEmptyString(exercise.id)) !== null && _a !== void 0 ? _a : `${dayId}:exercise:${index}`,
        name: (_b = readNonEmptyString(exercise.name)) !== null && _b !== void 0 ? _b : '',
        sets: readNumber(exercise.sets, 0),
        reps: readNumber(exercise.reps, 0),
    };
}
function normalizeTrainingDay(planKey, day, path) {
    var _a, _b, _c;
    const dayId = (_a = readNonEmptyString(day.id)) !== null && _a !== void 0 ? _a : `${planKey}:day:${path}`;
    const exercises = Array.isArray(day.exercises) ? day.exercises : [];
    return {
        id: dayId,
        type: (_b = day.type) !== null && _b !== void 0 ? _b : 'day',
        name: (_c = readNonEmptyString(day.name)) !== null && _c !== void 0 ? _c : '训练日',
        exercises: exercises.map((exercise, index) => normalizeExercise(dayId, (exercise !== null && exercise !== void 0 ? exercise : {}), index)),
    };
}
function normalizeCycle(planKey, cycle, path) {
    var _a, _b, _c;
    const items = Array.isArray(cycle.items) ? cycle.items : [];
    return {
        id: (_a = readNonEmptyString(cycle.id)) !== null && _a !== void 0 ? _a : `${planKey}:cycle:${path}`,
        type: 'cycle',
        name: (_b = readNonEmptyString(cycle.name)) !== null && _b !== void 0 ? _b : '循环周期',
        description: (_c = readNonEmptyString(cycle.description)) !== null && _c !== void 0 ? _c : undefined,
        repeats: Math.max(1, readNumber(cycle.repeats, 1)),
        items: items.map((item, index) => normalizeScheduleItem(planKey, (item !== null && item !== void 0 ? item : {}), `${path}.${index}`)),
    };
}
function normalizeScheduleItem(planKey, item, path) {
    if (isCycleCandidate(item)) {
        return normalizeCycle(planKey, item, path);
    }
    return normalizeTrainingDay(planKey, item, path);
}
function normalizeWorkoutPlanStructure(planKey, plan) {
    return {
        schedule: plan.schedule === undefined
            ? undefined
            : plan.schedule.map((item, index) => normalizeScheduleItem(planKey, (item !== null && item !== void 0 ? item : {}), `schedule.${index}`)),
        trainingDays: plan.trainingDays === undefined
            ? undefined
            : plan.trainingDays.map((day, index) => normalizeTrainingDay(planKey, (day !== null && day !== void 0 ? day : {}), `training-days.${index}`)),
    };
}
//# sourceMappingURL=workout-plan-normalizer.js.map