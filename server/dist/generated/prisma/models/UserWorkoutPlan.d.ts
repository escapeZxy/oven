import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type UserWorkoutPlanModel = runtime.Types.Result.DefaultSelection<Prisma.$UserWorkoutPlanPayload>;
export type AggregateUserWorkoutPlan = {
    _count: UserWorkoutPlanCountAggregateOutputType | null;
    _avg: UserWorkoutPlanAvgAggregateOutputType | null;
    _sum: UserWorkoutPlanSumAggregateOutputType | null;
    _min: UserWorkoutPlanMinAggregateOutputType | null;
    _max: UserWorkoutPlanMaxAggregateOutputType | null;
};
export type UserWorkoutPlanAvgAggregateOutputType = {
    currentDayIndex: number | null;
};
export type UserWorkoutPlanSumAggregateOutputType = {
    currentDayIndex: number | null;
};
export type UserWorkoutPlanMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    workoutPlanId: string | null;
    startDate: Date | null;
    currentDayIndex: number | null;
    status: $Enums.UserWorkoutPlanStatus | null;
    isArchived: boolean | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserWorkoutPlanMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    workoutPlanId: string | null;
    startDate: Date | null;
    currentDayIndex: number | null;
    status: $Enums.UserWorkoutPlanStatus | null;
    isArchived: boolean | null;
    isActive: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserWorkoutPlanCountAggregateOutputType = {
    id: number;
    userId: number;
    workoutPlanId: number;
    startDate: number;
    currentDayIndex: number;
    status: number;
    isArchived: number;
    isActive: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type UserWorkoutPlanAvgAggregateInputType = {
    currentDayIndex?: true;
};
export type UserWorkoutPlanSumAggregateInputType = {
    currentDayIndex?: true;
};
export type UserWorkoutPlanMinAggregateInputType = {
    id?: true;
    userId?: true;
    workoutPlanId?: true;
    startDate?: true;
    currentDayIndex?: true;
    status?: true;
    isArchived?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserWorkoutPlanMaxAggregateInputType = {
    id?: true;
    userId?: true;
    workoutPlanId?: true;
    startDate?: true;
    currentDayIndex?: true;
    status?: true;
    isArchived?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserWorkoutPlanCountAggregateInputType = {
    id?: true;
    userId?: true;
    workoutPlanId?: true;
    startDate?: true;
    currentDayIndex?: true;
    status?: true;
    isArchived?: true;
    isActive?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type UserWorkoutPlanAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWorkoutPlanWhereInput;
    orderBy?: Prisma.UserWorkoutPlanOrderByWithRelationInput | Prisma.UserWorkoutPlanOrderByWithRelationInput[];
    cursor?: Prisma.UserWorkoutPlanWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserWorkoutPlanCountAggregateInputType;
    _avg?: UserWorkoutPlanAvgAggregateInputType;
    _sum?: UserWorkoutPlanSumAggregateInputType;
    _min?: UserWorkoutPlanMinAggregateInputType;
    _max?: UserWorkoutPlanMaxAggregateInputType;
};
export type GetUserWorkoutPlanAggregateType<T extends UserWorkoutPlanAggregateArgs> = {
    [P in keyof T & keyof AggregateUserWorkoutPlan]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUserWorkoutPlan[P]> : Prisma.GetScalarType<T[P], AggregateUserWorkoutPlan[P]>;
};
export type UserWorkoutPlanGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWorkoutPlanWhereInput;
    orderBy?: Prisma.UserWorkoutPlanOrderByWithAggregationInput | Prisma.UserWorkoutPlanOrderByWithAggregationInput[];
    by: Prisma.UserWorkoutPlanScalarFieldEnum[] | Prisma.UserWorkoutPlanScalarFieldEnum;
    having?: Prisma.UserWorkoutPlanScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserWorkoutPlanCountAggregateInputType | true;
    _avg?: UserWorkoutPlanAvgAggregateInputType;
    _sum?: UserWorkoutPlanSumAggregateInputType;
    _min?: UserWorkoutPlanMinAggregateInputType;
    _max?: UserWorkoutPlanMaxAggregateInputType;
};
export type UserWorkoutPlanGroupByOutputType = {
    id: string;
    userId: string;
    workoutPlanId: string;
    startDate: Date;
    currentDayIndex: number;
    status: $Enums.UserWorkoutPlanStatus;
    isArchived: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: UserWorkoutPlanCountAggregateOutputType | null;
    _avg: UserWorkoutPlanAvgAggregateOutputType | null;
    _sum: UserWorkoutPlanSumAggregateOutputType | null;
    _min: UserWorkoutPlanMinAggregateOutputType | null;
    _max: UserWorkoutPlanMaxAggregateOutputType | null;
};
export type GetUserWorkoutPlanGroupByPayload<T extends UserWorkoutPlanGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserWorkoutPlanGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserWorkoutPlanGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserWorkoutPlanGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserWorkoutPlanGroupByOutputType[P]>;
}>>;
export type UserWorkoutPlanWhereInput = {
    AND?: Prisma.UserWorkoutPlanWhereInput | Prisma.UserWorkoutPlanWhereInput[];
    OR?: Prisma.UserWorkoutPlanWhereInput[];
    NOT?: Prisma.UserWorkoutPlanWhereInput | Prisma.UserWorkoutPlanWhereInput[];
    id?: Prisma.StringFilter<"UserWorkoutPlan"> | string;
    userId?: Prisma.StringFilter<"UserWorkoutPlan"> | string;
    workoutPlanId?: Prisma.StringFilter<"UserWorkoutPlan"> | string;
    startDate?: Prisma.DateTimeFilter<"UserWorkoutPlan"> | Date | string;
    currentDayIndex?: Prisma.IntFilter<"UserWorkoutPlan"> | number;
    status?: Prisma.EnumUserWorkoutPlanStatusFilter<"UserWorkoutPlan"> | $Enums.UserWorkoutPlanStatus;
    isArchived?: Prisma.BoolFilter<"UserWorkoutPlan"> | boolean;
    isActive?: Prisma.BoolFilter<"UserWorkoutPlan"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"UserWorkoutPlan"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"UserWorkoutPlan"> | Date | string;
    logs?: Prisma.WorkoutLogListRelationFilter;
};
export type UserWorkoutPlanOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workoutPlanId?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    currentDayIndex?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    logs?: Prisma.WorkoutLogOrderByRelationAggregateInput;
};
export type UserWorkoutPlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.UserWorkoutPlanWhereInput | Prisma.UserWorkoutPlanWhereInput[];
    OR?: Prisma.UserWorkoutPlanWhereInput[];
    NOT?: Prisma.UserWorkoutPlanWhereInput | Prisma.UserWorkoutPlanWhereInput[];
    userId?: Prisma.StringFilter<"UserWorkoutPlan"> | string;
    workoutPlanId?: Prisma.StringFilter<"UserWorkoutPlan"> | string;
    startDate?: Prisma.DateTimeFilter<"UserWorkoutPlan"> | Date | string;
    currentDayIndex?: Prisma.IntFilter<"UserWorkoutPlan"> | number;
    status?: Prisma.EnumUserWorkoutPlanStatusFilter<"UserWorkoutPlan"> | $Enums.UserWorkoutPlanStatus;
    isArchived?: Prisma.BoolFilter<"UserWorkoutPlan"> | boolean;
    isActive?: Prisma.BoolFilter<"UserWorkoutPlan"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"UserWorkoutPlan"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"UserWorkoutPlan"> | Date | string;
    logs?: Prisma.WorkoutLogListRelationFilter;
}, "id">;
export type UserWorkoutPlanOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workoutPlanId?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    currentDayIndex?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.UserWorkoutPlanCountOrderByAggregateInput;
    _avg?: Prisma.UserWorkoutPlanAvgOrderByAggregateInput;
    _max?: Prisma.UserWorkoutPlanMaxOrderByAggregateInput;
    _min?: Prisma.UserWorkoutPlanMinOrderByAggregateInput;
    _sum?: Prisma.UserWorkoutPlanSumOrderByAggregateInput;
};
export type UserWorkoutPlanScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserWorkoutPlanScalarWhereWithAggregatesInput | Prisma.UserWorkoutPlanScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserWorkoutPlanScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserWorkoutPlanScalarWhereWithAggregatesInput | Prisma.UserWorkoutPlanScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"UserWorkoutPlan"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"UserWorkoutPlan"> | string;
    workoutPlanId?: Prisma.StringWithAggregatesFilter<"UserWorkoutPlan"> | string;
    startDate?: Prisma.DateTimeWithAggregatesFilter<"UserWorkoutPlan"> | Date | string;
    currentDayIndex?: Prisma.IntWithAggregatesFilter<"UserWorkoutPlan"> | number;
    status?: Prisma.EnumUserWorkoutPlanStatusWithAggregatesFilter<"UserWorkoutPlan"> | $Enums.UserWorkoutPlanStatus;
    isArchived?: Prisma.BoolWithAggregatesFilter<"UserWorkoutPlan"> | boolean;
    isActive?: Prisma.BoolWithAggregatesFilter<"UserWorkoutPlan"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"UserWorkoutPlan"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"UserWorkoutPlan"> | Date | string;
};
export type UserWorkoutPlanCreateInput = {
    id?: string;
    userId: string;
    workoutPlanId: string;
    startDate: Date | string;
    currentDayIndex?: number;
    status?: $Enums.UserWorkoutPlanStatus;
    isArchived?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    logs?: Prisma.WorkoutLogCreateNestedManyWithoutUserPlanInput;
};
export type UserWorkoutPlanUncheckedCreateInput = {
    id?: string;
    userId: string;
    workoutPlanId: string;
    startDate: Date | string;
    currentDayIndex?: number;
    status?: $Enums.UserWorkoutPlanStatus;
    isArchived?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    logs?: Prisma.WorkoutLogUncheckedCreateNestedManyWithoutUserPlanInput;
};
export type UserWorkoutPlanUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workoutPlanId?: Prisma.StringFieldUpdateOperationsInput | string;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    currentDayIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumUserWorkoutPlanStatusFieldUpdateOperationsInput | $Enums.UserWorkoutPlanStatus;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    logs?: Prisma.WorkoutLogUpdateManyWithoutUserPlanNestedInput;
};
export type UserWorkoutPlanUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workoutPlanId?: Prisma.StringFieldUpdateOperationsInput | string;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    currentDayIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumUserWorkoutPlanStatusFieldUpdateOperationsInput | $Enums.UserWorkoutPlanStatus;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    logs?: Prisma.WorkoutLogUncheckedUpdateManyWithoutUserPlanNestedInput;
};
export type UserWorkoutPlanCreateManyInput = {
    id?: string;
    userId: string;
    workoutPlanId: string;
    startDate: Date | string;
    currentDayIndex?: number;
    status?: $Enums.UserWorkoutPlanStatus;
    isArchived?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserWorkoutPlanUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workoutPlanId?: Prisma.StringFieldUpdateOperationsInput | string;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    currentDayIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumUserWorkoutPlanStatusFieldUpdateOperationsInput | $Enums.UserWorkoutPlanStatus;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserWorkoutPlanUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workoutPlanId?: Prisma.StringFieldUpdateOperationsInput | string;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    currentDayIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumUserWorkoutPlanStatusFieldUpdateOperationsInput | $Enums.UserWorkoutPlanStatus;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserWorkoutPlanCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workoutPlanId?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    currentDayIndex?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserWorkoutPlanAvgOrderByAggregateInput = {
    currentDayIndex?: Prisma.SortOrder;
};
export type UserWorkoutPlanMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workoutPlanId?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    currentDayIndex?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserWorkoutPlanMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workoutPlanId?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    currentDayIndex?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    isArchived?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserWorkoutPlanSumOrderByAggregateInput = {
    currentDayIndex?: Prisma.SortOrder;
};
export type UserWorkoutPlanScalarRelationFilter = {
    is?: Prisma.UserWorkoutPlanWhereInput;
    isNot?: Prisma.UserWorkoutPlanWhereInput;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type EnumUserWorkoutPlanStatusFieldUpdateOperationsInput = {
    set?: $Enums.UserWorkoutPlanStatus;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type UserWorkoutPlanCreateNestedOneWithoutLogsInput = {
    create?: Prisma.XOR<Prisma.UserWorkoutPlanCreateWithoutLogsInput, Prisma.UserWorkoutPlanUncheckedCreateWithoutLogsInput>;
    connectOrCreate?: Prisma.UserWorkoutPlanCreateOrConnectWithoutLogsInput;
    connect?: Prisma.UserWorkoutPlanWhereUniqueInput;
};
export type UserWorkoutPlanUpdateOneRequiredWithoutLogsNestedInput = {
    create?: Prisma.XOR<Prisma.UserWorkoutPlanCreateWithoutLogsInput, Prisma.UserWorkoutPlanUncheckedCreateWithoutLogsInput>;
    connectOrCreate?: Prisma.UserWorkoutPlanCreateOrConnectWithoutLogsInput;
    upsert?: Prisma.UserWorkoutPlanUpsertWithoutLogsInput;
    connect?: Prisma.UserWorkoutPlanWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserWorkoutPlanUpdateToOneWithWhereWithoutLogsInput, Prisma.UserWorkoutPlanUpdateWithoutLogsInput>, Prisma.UserWorkoutPlanUncheckedUpdateWithoutLogsInput>;
};
export type UserWorkoutPlanCreateWithoutLogsInput = {
    id?: string;
    userId: string;
    workoutPlanId: string;
    startDate: Date | string;
    currentDayIndex?: number;
    status?: $Enums.UserWorkoutPlanStatus;
    isArchived?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserWorkoutPlanUncheckedCreateWithoutLogsInput = {
    id?: string;
    userId: string;
    workoutPlanId: string;
    startDate: Date | string;
    currentDayIndex?: number;
    status?: $Enums.UserWorkoutPlanStatus;
    isArchived?: boolean;
    isActive?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserWorkoutPlanCreateOrConnectWithoutLogsInput = {
    where: Prisma.UserWorkoutPlanWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserWorkoutPlanCreateWithoutLogsInput, Prisma.UserWorkoutPlanUncheckedCreateWithoutLogsInput>;
};
export type UserWorkoutPlanUpsertWithoutLogsInput = {
    update: Prisma.XOR<Prisma.UserWorkoutPlanUpdateWithoutLogsInput, Prisma.UserWorkoutPlanUncheckedUpdateWithoutLogsInput>;
    create: Prisma.XOR<Prisma.UserWorkoutPlanCreateWithoutLogsInput, Prisma.UserWorkoutPlanUncheckedCreateWithoutLogsInput>;
    where?: Prisma.UserWorkoutPlanWhereInput;
};
export type UserWorkoutPlanUpdateToOneWithWhereWithoutLogsInput = {
    where?: Prisma.UserWorkoutPlanWhereInput;
    data: Prisma.XOR<Prisma.UserWorkoutPlanUpdateWithoutLogsInput, Prisma.UserWorkoutPlanUncheckedUpdateWithoutLogsInput>;
};
export type UserWorkoutPlanUpdateWithoutLogsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workoutPlanId?: Prisma.StringFieldUpdateOperationsInput | string;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    currentDayIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumUserWorkoutPlanStatusFieldUpdateOperationsInput | $Enums.UserWorkoutPlanStatus;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserWorkoutPlanUncheckedUpdateWithoutLogsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workoutPlanId?: Prisma.StringFieldUpdateOperationsInput | string;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    currentDayIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumUserWorkoutPlanStatusFieldUpdateOperationsInput | $Enums.UserWorkoutPlanStatus;
    isArchived?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserWorkoutPlanCountOutputType = {
    logs: number;
};
export type UserWorkoutPlanCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    logs?: boolean | UserWorkoutPlanCountOutputTypeCountLogsArgs;
};
export type UserWorkoutPlanCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkoutPlanCountOutputTypeSelect<ExtArgs> | null;
};
export type UserWorkoutPlanCountOutputTypeCountLogsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkoutLogWhereInput;
};
export type UserWorkoutPlanSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    workoutPlanId?: boolean;
    startDate?: boolean;
    currentDayIndex?: boolean;
    status?: boolean;
    isArchived?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    logs?: boolean | Prisma.UserWorkoutPlan$logsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserWorkoutPlanCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userWorkoutPlan"]>;
export type UserWorkoutPlanSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    workoutPlanId?: boolean;
    startDate?: boolean;
    currentDayIndex?: boolean;
    status?: boolean;
    isArchived?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["userWorkoutPlan"]>;
export type UserWorkoutPlanSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    workoutPlanId?: boolean;
    startDate?: boolean;
    currentDayIndex?: boolean;
    status?: boolean;
    isArchived?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["userWorkoutPlan"]>;
export type UserWorkoutPlanSelectScalar = {
    id?: boolean;
    userId?: boolean;
    workoutPlanId?: boolean;
    startDate?: boolean;
    currentDayIndex?: boolean;
    status?: boolean;
    isArchived?: boolean;
    isActive?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type UserWorkoutPlanOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "workoutPlanId" | "startDate" | "currentDayIndex" | "status" | "isArchived" | "isActive" | "createdAt" | "updatedAt", ExtArgs["result"]["userWorkoutPlan"]>;
export type UserWorkoutPlanInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    logs?: boolean | Prisma.UserWorkoutPlan$logsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserWorkoutPlanCountOutputTypeDefaultArgs<ExtArgs>;
};
export type UserWorkoutPlanIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type UserWorkoutPlanIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $UserWorkoutPlanPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UserWorkoutPlan";
    objects: {
        logs: Prisma.$WorkoutLogPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        workoutPlanId: string;
        startDate: Date;
        currentDayIndex: number;
        status: $Enums.UserWorkoutPlanStatus;
        isArchived: boolean;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["userWorkoutPlan"]>;
    composites: {};
};
export type UserWorkoutPlanGetPayload<S extends boolean | null | undefined | UserWorkoutPlanDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserWorkoutPlanPayload, S>;
export type UserWorkoutPlanCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserWorkoutPlanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserWorkoutPlanCountAggregateInputType | true;
};
export interface UserWorkoutPlanDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['UserWorkoutPlan'];
        meta: {
            name: 'UserWorkoutPlan';
        };
    };
    findUnique<T extends UserWorkoutPlanFindUniqueArgs>(args: Prisma.SelectSubset<T, UserWorkoutPlanFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserWorkoutPlanClient<runtime.Types.Result.GetResult<Prisma.$UserWorkoutPlanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserWorkoutPlanFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserWorkoutPlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserWorkoutPlanClient<runtime.Types.Result.GetResult<Prisma.$UserWorkoutPlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserWorkoutPlanFindFirstArgs>(args?: Prisma.SelectSubset<T, UserWorkoutPlanFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserWorkoutPlanClient<runtime.Types.Result.GetResult<Prisma.$UserWorkoutPlanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserWorkoutPlanFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserWorkoutPlanFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserWorkoutPlanClient<runtime.Types.Result.GetResult<Prisma.$UserWorkoutPlanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserWorkoutPlanFindManyArgs>(args?: Prisma.SelectSubset<T, UserWorkoutPlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserWorkoutPlanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserWorkoutPlanCreateArgs>(args: Prisma.SelectSubset<T, UserWorkoutPlanCreateArgs<ExtArgs>>): Prisma.Prisma__UserWorkoutPlanClient<runtime.Types.Result.GetResult<Prisma.$UserWorkoutPlanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserWorkoutPlanCreateManyArgs>(args?: Prisma.SelectSubset<T, UserWorkoutPlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserWorkoutPlanCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserWorkoutPlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserWorkoutPlanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserWorkoutPlanDeleteArgs>(args: Prisma.SelectSubset<T, UserWorkoutPlanDeleteArgs<ExtArgs>>): Prisma.Prisma__UserWorkoutPlanClient<runtime.Types.Result.GetResult<Prisma.$UserWorkoutPlanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserWorkoutPlanUpdateArgs>(args: Prisma.SelectSubset<T, UserWorkoutPlanUpdateArgs<ExtArgs>>): Prisma.Prisma__UserWorkoutPlanClient<runtime.Types.Result.GetResult<Prisma.$UserWorkoutPlanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserWorkoutPlanDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserWorkoutPlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserWorkoutPlanUpdateManyArgs>(args: Prisma.SelectSubset<T, UserWorkoutPlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserWorkoutPlanUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserWorkoutPlanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserWorkoutPlanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserWorkoutPlanUpsertArgs>(args: Prisma.SelectSubset<T, UserWorkoutPlanUpsertArgs<ExtArgs>>): Prisma.Prisma__UserWorkoutPlanClient<runtime.Types.Result.GetResult<Prisma.$UserWorkoutPlanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserWorkoutPlanCountArgs>(args?: Prisma.Subset<T, UserWorkoutPlanCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserWorkoutPlanCountAggregateOutputType> : number>;
    aggregate<T extends UserWorkoutPlanAggregateArgs>(args: Prisma.Subset<T, UserWorkoutPlanAggregateArgs>): Prisma.PrismaPromise<GetUserWorkoutPlanAggregateType<T>>;
    groupBy<T extends UserWorkoutPlanGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserWorkoutPlanGroupByArgs['orderBy'];
    } : {
        orderBy?: UserWorkoutPlanGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserWorkoutPlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserWorkoutPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserWorkoutPlanFieldRefs;
}
export interface Prisma__UserWorkoutPlanClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    logs<T extends Prisma.UserWorkoutPlan$logsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserWorkoutPlan$logsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkoutLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserWorkoutPlanFieldRefs {
    readonly id: Prisma.FieldRef<"UserWorkoutPlan", 'String'>;
    readonly userId: Prisma.FieldRef<"UserWorkoutPlan", 'String'>;
    readonly workoutPlanId: Prisma.FieldRef<"UserWorkoutPlan", 'String'>;
    readonly startDate: Prisma.FieldRef<"UserWorkoutPlan", 'DateTime'>;
    readonly currentDayIndex: Prisma.FieldRef<"UserWorkoutPlan", 'Int'>;
    readonly status: Prisma.FieldRef<"UserWorkoutPlan", 'UserWorkoutPlanStatus'>;
    readonly isArchived: Prisma.FieldRef<"UserWorkoutPlan", 'Boolean'>;
    readonly isActive: Prisma.FieldRef<"UserWorkoutPlan", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"UserWorkoutPlan", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"UserWorkoutPlan", 'DateTime'>;
}
export type UserWorkoutPlanFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.UserWorkoutPlanOmit<ExtArgs> | null;
    include?: Prisma.UserWorkoutPlanInclude<ExtArgs> | null;
    where: Prisma.UserWorkoutPlanWhereUniqueInput;
};
export type UserWorkoutPlanFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.UserWorkoutPlanOmit<ExtArgs> | null;
    include?: Prisma.UserWorkoutPlanInclude<ExtArgs> | null;
    where: Prisma.UserWorkoutPlanWhereUniqueInput;
};
export type UserWorkoutPlanFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.UserWorkoutPlanOmit<ExtArgs> | null;
    include?: Prisma.UserWorkoutPlanInclude<ExtArgs> | null;
    where?: Prisma.UserWorkoutPlanWhereInput;
    orderBy?: Prisma.UserWorkoutPlanOrderByWithRelationInput | Prisma.UserWorkoutPlanOrderByWithRelationInput[];
    cursor?: Prisma.UserWorkoutPlanWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserWorkoutPlanScalarFieldEnum | Prisma.UserWorkoutPlanScalarFieldEnum[];
};
export type UserWorkoutPlanFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.UserWorkoutPlanOmit<ExtArgs> | null;
    include?: Prisma.UserWorkoutPlanInclude<ExtArgs> | null;
    where?: Prisma.UserWorkoutPlanWhereInput;
    orderBy?: Prisma.UserWorkoutPlanOrderByWithRelationInput | Prisma.UserWorkoutPlanOrderByWithRelationInput[];
    cursor?: Prisma.UserWorkoutPlanWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserWorkoutPlanScalarFieldEnum | Prisma.UserWorkoutPlanScalarFieldEnum[];
};
export type UserWorkoutPlanFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.UserWorkoutPlanOmit<ExtArgs> | null;
    include?: Prisma.UserWorkoutPlanInclude<ExtArgs> | null;
    where?: Prisma.UserWorkoutPlanWhereInput;
    orderBy?: Prisma.UserWorkoutPlanOrderByWithRelationInput | Prisma.UserWorkoutPlanOrderByWithRelationInput[];
    cursor?: Prisma.UserWorkoutPlanWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserWorkoutPlanScalarFieldEnum | Prisma.UserWorkoutPlanScalarFieldEnum[];
};
export type UserWorkoutPlanCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.UserWorkoutPlanOmit<ExtArgs> | null;
    include?: Prisma.UserWorkoutPlanInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserWorkoutPlanCreateInput, Prisma.UserWorkoutPlanUncheckedCreateInput>;
};
export type UserWorkoutPlanCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserWorkoutPlanCreateManyInput | Prisma.UserWorkoutPlanCreateManyInput[];
};
export type UserWorkoutPlanCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkoutPlanSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserWorkoutPlanOmit<ExtArgs> | null;
    data: Prisma.UserWorkoutPlanCreateManyInput | Prisma.UserWorkoutPlanCreateManyInput[];
};
export type UserWorkoutPlanUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.UserWorkoutPlanOmit<ExtArgs> | null;
    include?: Prisma.UserWorkoutPlanInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserWorkoutPlanUpdateInput, Prisma.UserWorkoutPlanUncheckedUpdateInput>;
    where: Prisma.UserWorkoutPlanWhereUniqueInput;
};
export type UserWorkoutPlanUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserWorkoutPlanUpdateManyMutationInput, Prisma.UserWorkoutPlanUncheckedUpdateManyInput>;
    where?: Prisma.UserWorkoutPlanWhereInput;
    limit?: number;
};
export type UserWorkoutPlanUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkoutPlanSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserWorkoutPlanOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserWorkoutPlanUpdateManyMutationInput, Prisma.UserWorkoutPlanUncheckedUpdateManyInput>;
    where?: Prisma.UserWorkoutPlanWhereInput;
    limit?: number;
};
export type UserWorkoutPlanUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.UserWorkoutPlanOmit<ExtArgs> | null;
    include?: Prisma.UserWorkoutPlanInclude<ExtArgs> | null;
    where: Prisma.UserWorkoutPlanWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserWorkoutPlanCreateInput, Prisma.UserWorkoutPlanUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserWorkoutPlanUpdateInput, Prisma.UserWorkoutPlanUncheckedUpdateInput>;
};
export type UserWorkoutPlanDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.UserWorkoutPlanOmit<ExtArgs> | null;
    include?: Prisma.UserWorkoutPlanInclude<ExtArgs> | null;
    where: Prisma.UserWorkoutPlanWhereUniqueInput;
};
export type UserWorkoutPlanDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWorkoutPlanWhereInput;
    limit?: number;
};
export type UserWorkoutPlan$logsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutLogSelect<ExtArgs> | null;
    omit?: Prisma.WorkoutLogOmit<ExtArgs> | null;
    include?: Prisma.WorkoutLogInclude<ExtArgs> | null;
    where?: Prisma.WorkoutLogWhereInput;
    orderBy?: Prisma.WorkoutLogOrderByWithRelationInput | Prisma.WorkoutLogOrderByWithRelationInput[];
    cursor?: Prisma.WorkoutLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkoutLogScalarFieldEnum | Prisma.WorkoutLogScalarFieldEnum[];
};
export type UserWorkoutPlanDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserWorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.UserWorkoutPlanOmit<ExtArgs> | null;
    include?: Prisma.UserWorkoutPlanInclude<ExtArgs> | null;
};
