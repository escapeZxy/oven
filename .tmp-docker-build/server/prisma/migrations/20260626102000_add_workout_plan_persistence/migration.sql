-- CreateTable
CREATE TABLE "WorkoutPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "schedule" JSONB,
    "trainingDays" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Seed legacy in-memory plans so existing userspace keeps working after migration.
INSERT INTO "WorkoutPlan" ("id", "name", "description", "schedule", "trainingDays", "createdAt", "updatedAt")
VALUES
(
    'plan-1',
    '力量提升 5x5',
    '一个适合初学者的简单有效的全身力量训练计划。',
    '[{"id":"cycle-1","type":"cycle","name":"基础力量循环","repeats":4,"items":[{"id":"day-1","type":"day","name":"训练 A","exercises":[{"id":"squat","name":"深蹲","sets":5,"reps":5},{"id":"bench-press","name":"卧推","sets":5,"reps":5},{"id":"barbell-row","name":"杠铃划船","sets":5,"reps":5}]},{"id":"day-2","type":"day","name":"休息","exercises":[]},{"id":"day-3","type":"day","name":"训练 B","exercises":[{"id":"squat","name":"深蹲","sets":5,"reps":5},{"id":"overhead-press","name":"过头推举","sets":5,"reps":5},{"id":"deadlift","name":"硬拉","sets":1,"reps":5}]},{"id":"day-4","type":"day","name":"休息","exercises":[]}]}]',
    '[]',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'plan-2',
    '混合编排示例 (混合结构)',
    '展示循环和单日训练的混合编排能力：准备周 + 增肌循环 + 测试日。',
    '[{"id":"intro-1","type":"day","name":"准备周：全身激活","exercises":[{"id":"mobility","name":"全身关节活动","sets":3,"reps":10}]},{"id":"intro-rest","type":"day","name":"准备周：休息","exercises":[]},{"id":"hypertrophy-cycle","type":"cycle","name":"增肌期循环","repeats":3,"items":[{"id":"upper","type":"day","name":"上肢训练","exercises":[{"id":"bench","name":"卧推","sets":4,"reps":8}]},{"id":"lower","type":"day","name":"下肢训练","exercises":[{"id":"squat","name":"深蹲","sets":4,"reps":8}]},{"id":"rest","type":"day","name":"休息","exercises":[]}]},{"id":"test-day","type":"day","name":"最大力量测试日","exercises":[{"id":"test-squat","name":"深蹲 1RM 测试","sets":1,"reps":1},{"id":"test-bench","name":"卧推 1RM 测试","sets":1,"reps":1}]}]',
    '[]',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    'plan-3',
    '初始力量 (旧结构兼容)',
    '使用旧的 trainingDays 结构，测试兼容性。',
    NULL,
    '[{"id":"day-1","type":"training","name":"基础训练 A","exercises":[{"id":"squat","name":"深蹲","sets":3,"reps":5},{"id":"press","name":"推举","sets":3,"reps":5}]},{"id":"day-2","type":"rest","name":"休息","exercises":[]}]',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
