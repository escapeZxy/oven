"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutService = void 0;
var uuid_1 = require("uuid");
var WorkoutService = /** @class */ (function () {
    function WorkoutService(userWorkoutPlanRepository, workoutPlanRepository, workoutLogRepository) {
        this.userWorkoutPlanRepository = userWorkoutPlanRepository;
        this.workoutPlanRepository = workoutPlanRepository;
        this.workoutLogRepository = workoutLogRepository;
    }
    WorkoutService.prototype.getLastExerciseLog = function (userId, exerciseId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.workoutLogRepository.getLastLog(userId, exerciseId)];
            });
        });
    };
    WorkoutService.prototype.getAllLogs = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.workoutLogRepository.findAllByUserId(userId)];
            });
        });
    };
    WorkoutService.prototype.startPlan = function (userId, workoutPlanId) {
        return __awaiter(this, void 0, void 0, function () {
            var workoutPlan, newUserPlan;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.workoutPlanRepository.findById(workoutPlanId)];
                    case 1:
                        workoutPlan = _a.sent();
                        if (!workoutPlan) {
                            throw new Error('Workout plan not found');
                        }
                        // Deactivate any active plans for the user (mark as interrupted)
                        return [4 /*yield*/, this.deactivateAllUserPlans(userId)];
                    case 2:
                        // Deactivate any active plans for the user (mark as interrupted)
                        _a.sent();
                        newUserPlan = {
                            userId: userId,
                            workoutPlanId: workoutPlan.id,
                            startDate: new Date().toISOString(),
                            currentDayIndex: 0,
                            isActive: true,
                            status: 'active',
                            logHistory: [],
                        };
                        return [2 /*return*/, this.userWorkoutPlanRepository.create(newUserPlan)];
                }
            });
        });
    };
    WorkoutService.prototype.resumePlan = function (userId, userPlanId) {
        return __awaiter(this, void 0, void 0, function () {
            var userPlan, updatedPlan, saved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userWorkoutPlanRepository.findById(userPlanId)];
                    case 1:
                        userPlan = _a.sent();
                        if (!userPlan) {
                            throw new Error('User workout plan not found');
                        }
                        // Deactivate any currently active plans
                        return [4 /*yield*/, this.deactivateAllUserPlans(userId)];
                    case 2:
                        // Deactivate any currently active plans
                        _a.sent();
                        updatedPlan = __assign(__assign({}, userPlan), { isActive: true, status: 'active' });
                        return [4 /*yield*/, this.userWorkoutPlanRepository.update(updatedPlan)];
                    case 3:
                        saved = _a.sent();
                        if (!saved) {
                            throw new Error('Failed to update plan status');
                        }
                        return [2 /*return*/, saved];
                }
            });
        });
    };
    WorkoutService.prototype.archivePlan = function (userPlanId) {
        return __awaiter(this, void 0, void 0, function () {
            var userPlan, updatedPlan, saved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userWorkoutPlanRepository.findById(userPlanId)];
                    case 1:
                        userPlan = _a.sent();
                        if (!userPlan) {
                            throw new Error('User workout plan not found');
                        }
                        // We can only archive non-active plans
                        if (userPlan.status === 'active' || userPlan.isActive) {
                            throw new Error('Cannot archive an active plan');
                        }
                        updatedPlan = __assign(__assign({}, userPlan), { isArchived: true });
                        return [4 /*yield*/, this.userWorkoutPlanRepository.update(updatedPlan)];
                    case 2:
                        saved = _a.sent();
                        if (!saved) {
                            throw new Error('Failed to archive plan');
                        }
                        return [2 /*return*/, saved];
                }
            });
        });
    };
    WorkoutService.prototype.deactivateAllUserPlans = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var activePlan, updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userWorkoutPlanRepository.findActiveByUserId(userId)];
                    case 1:
                        activePlan = _a.sent();
                        if (!activePlan) return [3 /*break*/, 3];
                        updated = __assign(__assign({}, activePlan), { isActive: false, status: 'interrupted' });
                        return [4 /*yield*/, this.userWorkoutPlanRepository.update(updated)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    WorkoutService.prototype.logWorkout = function (userWorkoutPlanId, completedExercises) {
        return __awaiter(this, void 0, void 0, function () {
            var currentPlan, workoutPlan, updatedPlan, savedPlan, lastLog;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userWorkoutPlanRepository.findById(userWorkoutPlanId)];
                    case 1:
                        currentPlan = _a.sent();
                        if (!currentPlan) {
                            throw new Error('User workout plan not found');
                        }
                        return [4 /*yield*/, this.workoutPlanRepository.findById(currentPlan.workoutPlanId)];
                    case 2:
                        workoutPlan = _a.sent();
                        if (!workoutPlan) {
                            throw new Error('Workout plan not found');
                        }
                        updatedPlan = this._updatePlanWithNewLog(currentPlan, workoutPlan, 'completed', completedExercises);
                        return [4 /*yield*/, this.userWorkoutPlanRepository.update(updatedPlan)];
                    case 3:
                        savedPlan = _a.sent();
                        if (!savedPlan) {
                            throw new Error('Failed to update user workout plan');
                        }
                        lastLog = updatedPlan.logHistory[updatedPlan.logHistory.length - 1];
                        return [4 /*yield*/, this.workoutLogRepository.create(lastLog)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, savedPlan];
                }
            });
        });
    };
    WorkoutService.prototype.skipDay = function (userWorkoutPlanId) {
        return __awaiter(this, void 0, void 0, function () {
            var currentPlan, workoutPlan, updatedPlan, savedPlan, lastLog;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userWorkoutPlanRepository.findById(userWorkoutPlanId)];
                    case 1:
                        currentPlan = _a.sent();
                        if (!currentPlan) {
                            throw new Error('User workout plan not found');
                        }
                        return [4 /*yield*/, this.workoutPlanRepository.findById(currentPlan.workoutPlanId)];
                    case 2:
                        workoutPlan = _a.sent();
                        if (!workoutPlan) {
                            throw new Error('Workout plan not found');
                        }
                        updatedPlan = this._updatePlanWithNewLog(currentPlan, workoutPlan, 'skipped', []);
                        return [4 /*yield*/, this.userWorkoutPlanRepository.update(updatedPlan)];
                    case 3:
                        savedPlan = _a.sent();
                        if (!savedPlan) {
                            throw new Error('Failed to update user workout plan');
                        }
                        lastLog = updatedPlan.logHistory[updatedPlan.logHistory.length - 1];
                        return [4 /*yield*/, this.workoutLogRepository.create(lastLog)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, savedPlan];
                }
            });
        });
    };
    WorkoutService.prototype.getActivePlan = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.userWorkoutPlanRepository.findActiveByUserId(userId)];
            });
        });
    };
    WorkoutService.prototype.getAllPlans = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.userWorkoutPlanRepository.findByUserId(userId)];
            });
        });
    };
    WorkoutService.prototype.getPlanDefinitions = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.workoutPlanRepository.findAll()];
            });
        });
    };
    WorkoutService.prototype.createPlanDefinition = function (planData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Here you could add more complex logic, like ensuring exercise IDs are valid, etc.
                // For now, we just pass it to the repository.
                return [2 /*return*/, this.workoutPlanRepository.create(planData)];
            });
        });
    };
    /**
     * Flattens the schedule structure into a linear list of training days.
     * This handles mixing cycles and individual days, and unrolls repeated cycles.
     */
    WorkoutService.prototype.flattenPlan = function (plan) {
        if (!plan.schedule || plan.schedule.length === 0) {
            // Fallback to old trainingDays if schedule is missing
            return plan.trainingDays || [];
        }
        return this._flattenScheduleItems(plan.schedule);
    };
    WorkoutService.prototype._flattenScheduleItems = function (items) {
        var flattened = [];
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            // Check if it's a cycle (has 'type' === 'cycle' OR has 'items' property for safety)
            if ('type' in item && item.type === 'cycle') {
                var cycleDays = this._flattenScheduleItems(item.items);
                for (var i = 0; i < item.repeats; i++) {
                    flattened.push.apply(flattened, cycleDays);
                }
            }
            else {
                // It's a TrainingDay
                // We assume it's a TrainingDay if it's not a cycle.
                // In a strictly typed world, we'd check item.type === 'day' or 'training' or 'rest'
                flattened.push(item);
            }
        }
        return flattened;
    };
    WorkoutService.prototype._updatePlanWithNewLog = function (currentPlan, workoutPlan, status, completedExercises) {
        // Use flattenPlan to get the correct linear day
        var allDays = this.flattenPlan(workoutPlan);
        var currentDay = allDays[currentPlan.currentDayIndex];
        if (!currentDay) {
            throw new Error("Invalid currentDayIndex: ".concat(currentPlan.currentDayIndex));
        }
        var trainingDayId = currentDay.id;
        var newLog = {
            id: (0, uuid_1.v4)(),
            userId: currentPlan.userId,
            workoutPlanId: currentPlan.workoutPlanId,
            trainingDayId: trainingDayId,
            date: new Date().toISOString(),
            status: status,
            completedExercises: completedExercises,
        };
        var isLastDay = currentPlan.currentDayIndex === allDays.length - 1;
        return __assign(__assign({}, currentPlan), { currentDayIndex: currentPlan.currentDayIndex + 1, logHistory: __spreadArray(__spreadArray([], currentPlan.logHistory, true), [newLog], false), isActive: !isLastDay, status: isLastDay ? 'completed' : 'active' });
    };
    return WorkoutService;
}());
exports.WorkoutService = WorkoutService;
