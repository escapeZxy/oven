import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UserPlanCompletionSummary, UserWorkoutPlan } from '@oven/core';
import { AuthenticatedUser } from '../auth/auth.types';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommitUserPlanLogDto } from './dto/commit-user-plan-log.dto';
import { CreateUserPlanDto } from './dto/create-user-plan.dto';
import { GetUserPlansDto } from './dto/get-user-plans.dto';
import { UserPlansService } from './user-plans.service';

/**
 * 暴露用户训练计划查询与写入接口。
 *
 * @example
 * ```http
 * GET /user-plans
 * ```
 */
@Controller('user-plans')
@UseGuards(JwtAuthGuard)
export class UserPlansController {
  constructor(private readonly userPlansService: UserPlansService) {}

  @Get('active')
  public async getActiveByUserId(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserWorkoutPlan | null> {
    return this.userPlansService.getActiveByUserId(user.id);
  }

  @Get('completion-rate')
  public async getCompletionRate(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserPlanCompletionSummary> {
    return this.userPlansService.getCompletionRateSummary(user.id);
  }

  @Get(':id')
  public async getById(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserWorkoutPlan> {
    return this.userPlansService.getById(id, user.id);
  }

  @Get()
  public async getByUserId(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: GetUserPlansDto,
  ): Promise<UserWorkoutPlan[]> {
    return this.userPlansService.getByUserId(user.id, query);
  }

  @Post()
  public async create(
    @Body() dto: CreateUserPlanDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserWorkoutPlan> {
    return this.userPlansService.create(dto, user.id);
  }

  /**
   * 原子提交一次训练结果，同时写入日志并推进用户计划。
   * `logStatus` 支持 `completed` 与 `skipped`。
   */
  @Post(':id/logs')
  public async appendLog(
    @Param('id') id: string,
    @Body() dto: CommitUserPlanLogDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserWorkoutPlan> {
    return this.userPlansService.appendLog(id, dto, user.id);
  }

  @Post(':id/resume')
  public async resume(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserWorkoutPlan> {
    return this.userPlansService.resume(id, user.id);
  }

  @Post(':id/archive')
  public async archive(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UserWorkoutPlan> {
    return this.userPlansService.archive(id, user.id);
  }
}
