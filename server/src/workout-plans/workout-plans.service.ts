import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ScheduleItem, TrainingDay, WorkoutPlan } from '@oven/core';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, type WorkoutPlan as PrismaWorkoutPlan } from '../generated/prisma/client';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { GetWorkoutPlansDto } from './dto/get-workout-plans.dto';
import { normalizeWorkoutPlanStructure } from './workout-plan-normalizer';

/**
 * 封装训练计划 definition 的读取与创建。
 *
 * @example
 * ```ts
 * const plans = await workoutPlansService.getAll();
 * ```
 */
@Injectable()
export class WorkoutPlansService {
  public constructor(private readonly prisma: PrismaService) {}

  public async getAll(query: GetWorkoutPlansDto = {}): Promise<WorkoutPlan[]> {
    const plans = await this.prisma.workoutPlan.findMany({
      where: query.updatedAfter
        ? {
            updatedAt: {
              gte: new Date(query.updatedAfter),
            },
          }
        : undefined,
      orderBy: [{ updatedAt: 'asc' }, { id: 'asc' }],
      take: query.limit,
    });

    return plans.map((plan) => this.mapWorkoutPlan(plan));
  }

  public async getById(id: string): Promise<WorkoutPlan> {
    const plan = await this.prisma.workoutPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException(`Workout plan "${id}" not found.`);
    }

    return this.mapWorkoutPlan(plan);
  }

  public async create(dto: CreateWorkoutPlanDto): Promise<WorkoutPlan> {
    const normalized = normalizeWorkoutPlanStructure(randomUUID(), {
      schedule: dto.schedule,
      trainingDays: dto.trainingDays,
    });

    const created = await this.prisma.workoutPlan.create({
      data: {
        name: dto.name,
        description: dto.description,
        ...(normalized.schedule !== undefined
          ? {
              schedule: normalized.schedule as unknown as Prisma.InputJsonValue,
            }
          : {}),
        ...(normalized.trainingDays !== undefined
          ? {
              trainingDays: normalized.trainingDays as unknown as Prisma.InputJsonValue,
            }
          : {}),
      },
    });

    return this.mapWorkoutPlan(created);
  }

  private mapWorkoutPlan(plan: PrismaWorkoutPlan): WorkoutPlan {
    const normalized = normalizeWorkoutPlanStructure(plan.id, {
      schedule: this.readSchedule(plan.schedule),
      trainingDays: this.readTrainingDays(plan.trainingDays),
    });

    return {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      createdAt: plan.createdAt.toISOString(),
      updatedAt: plan.updatedAt.toISOString(),
      schedule: normalized.schedule,
      trainingDays: normalized.trainingDays,
    };
  }

  private readSchedule(value: Prisma.JsonValue | null): ScheduleItem[] | undefined {
    if (value === null) {
      return undefined;
    }

    if (!Array.isArray(value)) {
      throw new Error('Invalid workout plan schedule stored in database.');
    }

    return value as unknown as ScheduleItem[];
  }

  private readTrainingDays(value: Prisma.JsonValue | null): TrainingDay[] | undefined {
    if (value === null) {
      return undefined;
    }

    if (!Array.isArray(value)) {
      throw new Error('Invalid workout plan trainingDays stored in database.');
    }

    return value as unknown as TrainingDay[];
  }
}
