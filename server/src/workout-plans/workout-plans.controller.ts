import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { WorkoutPlan } from '@oven/core';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateWorkoutPlanDto } from './dto/create-workout-plan.dto';
import { GetWorkoutPlansDto } from './dto/get-workout-plans.dto';
import { WorkoutPlansService } from './workout-plans.service';

/**
 * 暴露训练计划 definition 查询与创建接口。
 *
 * @example
 * ```http
 * GET /workout-plans
 * ```
 */
@Controller('workout-plans')
export class WorkoutPlansController {
  public constructor(private readonly workoutPlansService: WorkoutPlansService) {}

  @Get()
  public async getAll(@Query() query: GetWorkoutPlansDto): Promise<WorkoutPlan[]> {
    return this.workoutPlansService.getAll(query);
  }

  @Get(':id')
  public async getById(@Param('id') id: string): Promise<WorkoutPlan> {
    return this.workoutPlansService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async create(@Body() dto: CreateWorkoutPlanDto): Promise<WorkoutPlan> {
    return this.workoutPlansService.create(dto);
  }
}
