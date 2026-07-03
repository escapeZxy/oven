import { UserPlanCompletionSummary, UserWorkoutPlan } from '@oven/core';
import { AuthenticatedUser } from '../auth/auth.types';
import { CommitUserPlanLogDto } from './dto/commit-user-plan-log.dto';
import { CreateUserPlanDto } from './dto/create-user-plan.dto';
import { GetUserPlansDto } from './dto/get-user-plans.dto';
import { UserPlansService } from './user-plans.service';
export declare class UserPlansController {
    private readonly userPlansService;
    constructor(userPlansService: UserPlansService);
    getActiveByUserId(user: AuthenticatedUser): Promise<UserWorkoutPlan | null>;
    getCompletionRate(user: AuthenticatedUser): Promise<UserPlanCompletionSummary>;
    getById(id: string, user: AuthenticatedUser): Promise<UserWorkoutPlan>;
    getByUserId(user: AuthenticatedUser, query: GetUserPlansDto): Promise<UserWorkoutPlan[]>;
    create(dto: CreateUserPlanDto, user: AuthenticatedUser): Promise<UserWorkoutPlan>;
    appendLog(id: string, dto: CommitUserPlanLogDto, user: AuthenticatedUser): Promise<UserWorkoutPlan>;
    resume(id: string, user: AuthenticatedUser): Promise<UserWorkoutPlan>;
    archive(id: string, user: AuthenticatedUser): Promise<UserWorkoutPlan>;
}
