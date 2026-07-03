"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutPlanRepository = void 0;
const uuid_1 = require("uuid");
const MOCK_WORKOUT_PLANS = [
    {
        id: 'plan-1',
        name: '力量提升 5x5',
        description: '一个适合初学者的简单有效的全身力量训练计划。',
        trainingDays: [],
        schedule: [
            {
                id: 'cycle-1',
                type: 'cycle',
                name: '基础力量循环',
                repeats: 4,
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
            {
                id: 'intro-1',
                type: 'day',
                name: '准备周：全身激活',
                exercises: [{ id: 'mobility', name: '全身关节活动', sets: 3, reps: 10 }]
            },
            { id: 'intro-rest', type: 'day', name: '准备周：休息', exercises: [] },
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
                type: 'training',
                name: '基础训练 A',
                exercises: [
                    { id: 'squat', name: '深蹲', sets: 3, reps: 5 },
                    { id: 'press', name: '推举', sets: 3, reps: 5 },
                ],
            },
            { id: 'day-2', type: 'rest', name: '休息', exercises: [] }
        ],
    },
];
class WorkoutPlanRepository {
    constructor() {
        this.plans = MOCK_WORKOUT_PLANS;
    }
    async create(planData) {
        const newPlan = Object.assign({ id: (0, uuid_1.v4)() }, planData);
        this.plans.push(newPlan);
        return newPlan;
    }
    async findById(id) {
        return this.plans.find(plan => plan.id === id) || null;
    }
    async findAll() {
        return [...this.plans];
    }
    async update(plan) {
        const existingIndex = this.plans.findIndex(p => p.id === plan.id);
        if (existingIndex === -1) {
            return null;
        }
        this.plans = [
            ...this.plans.slice(0, existingIndex),
            plan,
            ...this.plans.slice(existingIndex + 1)
        ];
        return plan;
    }
    async delete(id) {
        const initialLength = this.plans.length;
        this.plans = this.plans.filter(plan => plan.id !== id);
        return this.plans.length < initialLength;
    }
}
exports.WorkoutPlanRepository = WorkoutPlanRepository;
//# sourceMappingURL=workout-plan.repository.js.map