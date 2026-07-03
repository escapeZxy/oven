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
exports.WorkoutPlanRepository = void 0;
var uuid_1 = require("uuid");
var MOCK_WORKOUT_PLANS = [
    {
        id: 'plan-1',
        name: '力量提升 5x5',
        description: '一个适合初学者的简单有效的全身力量训练计划。',
        // Fallback for old system
        trainingDays: [],
        // New schedule structure
        schedule: [
            {
                id: 'cycle-1',
                type: 'cycle',
                name: '基础力量循环',
                repeats: 4, // 4 weeks
                items: [
                    {
                        id: 'day-1',
                        type: 'day',
                        name: '训练 A',
                        exercises: [
                            { id: 'squat', name: '深蹲', sets: 5, reps: 5 },
                            { id: 'bench-press', name: '卧推', sets: 5, reps: 5 },
                            { id: 'barbell-row', name: '杠铃划船', sets: 5, reps: 5 },
                        ],
                    },
                    { id: 'day-2', type: 'day', name: '休息', exercises: [] },
                    {
                        id: 'day-3',
                        type: 'day',
                        name: '训练 B',
                        exercises: [
                            { id: 'squat', name: '深蹲', sets: 5, reps: 5 },
                            { id: 'overhead-press', name: '过头推举', sets: 5, reps: 5 },
                            { id: 'deadlift', name: '硬拉', sets: 1, reps: 5 },
                        ],
                    },
                    { id: 'day-4', type: 'day', name: '休息', exercises: [] },
                ]
            }
        ]
    },
    {
        id: 'plan-2',
        name: '混合编排示例 (混合结构)',
        description: '展示循环和单日训练的混合编排能力：准备周 + 增肌循环 + 测试日。',
        trainingDays: [],
        schedule: [
            // 1. Intro Week (Individual Days)
            {
                id: 'intro-1',
                type: 'day',
                name: '准备周：全身激活',
                exercises: [{ id: 'mobility', name: '全身关节活动', sets: 3, reps: 10 }]
            },
            { id: 'intro-rest', type: 'day', name: '准备周：休息', exercises: [] },
            // 2. Main Hypertrophy Cycle (Repeats 3 times)
            {
                id: 'hypertrophy-cycle',
                type: 'cycle',
                name: '增肌期循环',
                repeats: 3,
                items: [
                    {
                        id: 'upper',
                        type: 'day',
                        name: '上肢训练',
                        exercises: [{ id: 'bench', name: '卧推', sets: 4, reps: 8 }]
                    },
                    {
                        id: 'lower',
                        type: 'day',
                        name: '下肢训练',
                        exercises: [{ id: 'squat', name: '深蹲', sets: 4, reps: 8 }]
                    },
                    { id: 'rest', type: 'day', name: '休息', exercises: [] }
                ]
            },
            // 3. Testing Day (Individual Day)
            {
                id: 'test-day',
                type: 'day',
                name: '最大力量测试日',
                exercises: [
                    { id: 'test-squat', name: '深蹲 1RM 测试', sets: 1, reps: 1 },
                    { id: 'test-bench', name: '卧推 1RM 测试', sets: 1, reps: 1 }
                ]
            }
        ]
    },
    {
        id: 'plan-3',
        name: '初始力量 (旧结构兼容)',
        description: '使用旧的 trainingDays 结构，测试兼容性。',
        trainingDays: [
            {
                id: 'day-1',
                type: 'training', // Old type
                name: '基础训练 A',
                exercises: [
                    { id: 'squat', name: '深蹲', sets: 3, reps: 5 },
                    { id: 'press', name: '推举', sets: 3, reps: 5 },
                ],
            },
            { id: 'day-2', type: 'rest', name: '休息', exercises: [] }
        ], // Cast to any to bypass strict type check for 'type' field migration
    },
];
var WorkoutPlanRepository = /** @class */ (function () {
    function WorkoutPlanRepository() {
        this.plans = MOCK_WORKOUT_PLANS;
    }
    WorkoutPlanRepository.prototype.create = function (planData) {
        return __awaiter(this, void 0, void 0, function () {
            var newPlan;
            return __generator(this, function (_a) {
                newPlan = __assign({ id: (0, uuid_1.v4)() }, planData);
                this.plans.push(newPlan);
                return [2 /*return*/, newPlan];
            });
        });
    };
    WorkoutPlanRepository.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.plans.find(function (plan) { return plan.id === id; }) || null];
            });
        });
    };
    WorkoutPlanRepository.prototype.findAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, __spreadArray([], this.plans, true)];
            });
        });
    };
    WorkoutPlanRepository.prototype.update = function (plan) {
        return __awaiter(this, void 0, void 0, function () {
            var existingIndex;
            return __generator(this, function (_a) {
                existingIndex = this.plans.findIndex(function (p) { return p.id === plan.id; });
                if (existingIndex === -1) {
                    return [2 /*return*/, null];
                }
                this.plans = __spreadArray(__spreadArray(__spreadArray([], this.plans.slice(0, existingIndex), true), [
                    plan
                ], false), this.plans.slice(existingIndex + 1), true);
                return [2 /*return*/, plan];
            });
        });
    };
    WorkoutPlanRepository.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var initialLength;
            return __generator(this, function (_a) {
                initialLength = this.plans.length;
                this.plans = this.plans.filter(function (plan) { return plan.id !== id; });
                return [2 /*return*/, this.plans.length < initialLength];
            });
        });
    };
    return WorkoutPlanRepository;
}());
exports.WorkoutPlanRepository = WorkoutPlanRepository;
