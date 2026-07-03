import { v4 as uuidv4 } from 'uuid';
import { WorkoutPlan } from '../models';

const MOCK_WORKOUT_PLANS: WorkoutPlan[] = [
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
    ] as any[], // Cast to any to bypass strict type check for 'type' field migration
  },
];

export class WorkoutPlanRepository {
  private plans: WorkoutPlan[] = MOCK_WORKOUT_PLANS;

  public async create(planData: Omit<WorkoutPlan, 'id'>): Promise<WorkoutPlan> {
    const newPlan: WorkoutPlan = {
      id: uuidv4(),
      ...planData,
    };
    this.plans.push(newPlan);
    return newPlan;
  }

  public async findById(id: string): Promise<WorkoutPlan | null> {
    return this.plans.find(plan => plan.id === id) || null;
  }

  public async findAll(): Promise<WorkoutPlan[]> {
    return [...this.plans];
  }

  public async update(plan: WorkoutPlan): Promise<WorkoutPlan | null> {
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

  public async delete(id: string): Promise<boolean> {
    const initialLength = this.plans.length;
    this.plans = this.plans.filter(plan => plan.id !== id);
    return this.plans.length < initialLength;
  }
}
