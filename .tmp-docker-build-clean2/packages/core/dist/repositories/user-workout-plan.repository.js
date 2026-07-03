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
exports.InMemoryUserWorkoutPlanRepository = void 0;
var uuid_1 = require("uuid");
var MOCK_USER_WORKOUT_PLANS = [
    {
        id: 'user-plan-1',
        userId: 'user-1',
        workoutPlanId: 'plan-1',
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // Started 10 days ago
        currentDayIndex: 4,
        isActive: true,
        status: 'active',
        isArchived: false,
        logHistory: [
            // Mock some history
            {
                id: 'log-1',
                userId: 'user-1',
                workoutPlanId: 'plan-1',
                trainingDayId: 'day-1',
                date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'completed',
                completedExercises: [],
            },
            {
                id: 'log-2',
                userId: 'user-1',
                workoutPlanId: 'plan-1',
                trainingDayId: 'day-3',
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'completed',
                completedExercises: [],
            },
        ],
    },
    {
        id: 'user-plan-2',
        userId: 'user-1',
        workoutPlanId: 'plan-2',
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Started 30 days ago
        currentDayIndex: 48, // Completed
        isActive: false,
        status: 'completed',
        isArchived: false,
        logHistory: [],
    },
];
var InMemoryUserWorkoutPlanRepository = /** @class */ (function () {
    function InMemoryUserWorkoutPlanRepository() {
        this.userPlans = MOCK_USER_WORKOUT_PLANS;
    }
    InMemoryUserWorkoutPlanRepository.prototype.create = function (planData) {
        return __awaiter(this, void 0, void 0, function () {
            var newPlan;
            return __generator(this, function (_a) {
                newPlan = __assign({ id: (0, uuid_1.v4)() }, planData);
                this.userPlans.push(newPlan);
                return [2 /*return*/, newPlan];
            });
        });
    };
    InMemoryUserWorkoutPlanRepository.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.userPlans.find(function (plan) { return plan.id === id; }) || null];
            });
        });
    };
    InMemoryUserWorkoutPlanRepository.prototype.findByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.userPlans.filter(function (plan) { return plan.userId === userId; })];
            });
        });
    };
    InMemoryUserWorkoutPlanRepository.prototype.findActiveByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.userPlans.find(function (plan) { return plan.userId === userId && plan.isActive; }) || null];
            });
        });
    };
    InMemoryUserWorkoutPlanRepository.prototype.update = function (plan) {
        return __awaiter(this, void 0, void 0, function () {
            var existingIndex;
            return __generator(this, function (_a) {
                existingIndex = this.userPlans.findIndex(function (p) { return p.id === plan.id; });
                if (existingIndex === -1) {
                    return [2 /*return*/, null];
                }
                this.userPlans = __spreadArray(__spreadArray(__spreadArray([], this.userPlans.slice(0, existingIndex), true), [
                    plan
                ], false), this.userPlans.slice(existingIndex + 1), true);
                return [2 /*return*/, plan];
            });
        });
    };
    InMemoryUserWorkoutPlanRepository.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var initialLength;
            return __generator(this, function (_a) {
                initialLength = this.userPlans.length;
                this.userPlans = this.userPlans.filter(function (plan) { return plan.id !== id; });
                return [2 /*return*/, this.userPlans.length < initialLength];
            });
        });
    };
    InMemoryUserWorkoutPlanRepository.prototype.deactivateAllUserPlans = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.userPlans = this.userPlans.map(function (plan) {
                    return plan.userId === userId ? __assign(__assign({}, plan), { isActive: false }) : plan;
                });
                return [2 /*return*/];
            });
        });
    };
    return InMemoryUserWorkoutPlanRepository;
}());
exports.InMemoryUserWorkoutPlanRepository = InMemoryUserWorkoutPlanRepository;
