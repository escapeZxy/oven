import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type WorkoutLogModel = runtime.Types.Result.DefaultSelection<Prisma.$WorkoutLogPayload>;
export type AggregateWorkoutLog = {
    _count: WorkoutLogCountAggregateOutputType | null;
    _min: WorkoutLogMinAggregateOutputType | null;
    _max: WorkoutLogMaxAggregateOutputType | null;
};
export type WorkoutLogMinAggregateOutputType = {
    id: string | null;
    clientRequestId: string | null;
    userPlanId: string | null;
    userId: string | null;
    workoutPlanId: string | null;
    trainingDayId: string | null;
    date: Date | null;
    status: $Enums.WorkoutLogStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type WorkoutLogMaxAggregateOutputType = {
    id: string | null;
    clientRequestId: string | null;
    userPlanId: string | null;
    userId: string | null;
    workoutPlanId: string | null;
    trainingDayId: string | null;
    date: Date | null;
    status: $Enums.WorkoutLogStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type WorkoutLogCountAggregateOutputType = {
    id: number;
    clientRequestId: number;
    userPlanId: number;
    userId: number;
    workoutPlanId: number;
    trainingDayId: number;
    date: number;
    status: number;
    completedExercises: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type WorkoutLogMinAggregateInputType = {
    id?: true;
    clientRequestId?: true;
    userPlanId?: true;
    userId?: true;
    workoutPlanId?: true;
    trainingDayId?: true;
    date?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type WorkoutLogMaxAggregateInputType = {
    id?: true;
    clientRequestId?: true;
    userPlanId?: true;
    userId?: true;
    workoutPlanId?: true;
    trainingDayId?: true;
    date?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type WorkoutLogCountAggregateInputType = {
    id?: true;
    clientRequestId?: true;
    userPlanId?: true;
    userId?: true;
    workoutPlanId?: true;
    trainingDayId?: true;
    date?: true;
    status?: true;
    completedExercises?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type WorkoutLogAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkoutLogWhereInput;
    orderBy?: Prisma.WorkoutLogOrderByWithRelationInput | Prisma.WorkoutLogOrderByWithRelationInput[];
    cursor?: Prisma.WorkoutLogWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | WorkoutLogCountAggregateInputType;
    _min?: WorkoutLogMinAggregateInputType;
    _max?: WorkoutLogMaxAggregateInputType;
};
export type GetWorkoutLogAggregateType<T extends WorkoutLogAggregateArgs> = {
    [P in keyof T & keyof AggregateWorkoutLog]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWorkoutLog[P]> : Prisma.GetScalarType<T[P], AggregateWorkoutLog[P]>;
};
export type WorkoutLogGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkoutLogWhereInput;
    orderBy?: Prisma.WorkoutLogOrderByWithAggregationInput | Prisma.WorkoutLogOrderByWithAggregationInput[];
    by: Prisma.WorkoutLogScalarFieldEnum[] | Prisma.WorkoutLogScalarFieldEnum;
    having?: Prisma.WorkoutLogScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WorkoutLogCountAggregateInputType | true;
    _min?: WorkoutLogMinAggregateInputType;
    _max?: WorkoutLogMaxAggregateInputType;
};
export type WorkoutLogGroupByOutputType = {
    id: string;
    clientRequestId: string | null;
    userPlanId: string;
    userId: string;
    workoutPlanId: string;
    trainingDayId: string;
    date: Date;
    status: $Enums.WorkoutLogStatus;
    completedExercises: runtime.JsonValue;
    createdAt: Date;
    updatedAt: Date;
    _count: WorkoutLogCountAggregateOutputType | null;
    _min: WorkoutLogMinAggregateOutputType | null;
    _max: WorkoutLogMaxAggregateOutputType | null;
};
export type GetWorkoutLogGroupByPayload<T extends WorkoutLogGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<WorkoutLogGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof WorkoutLogGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], WorkoutLogGroupByOutputType[P]> : Prisma.GetScalarType<T[P], WorkoutLogGroupByOutputType[P]>;
}>>;
export type WorkoutLogWhereInput = {
    AND?: Prisma.WorkoutLogWhereInput | Prisma.WorkoutLogWhereInput[];
    OR?: Prisma.WorkoutLogWhereInput[];
    NOT?: Prisma.WorkoutLogWhereInput | Prisma.WorkoutLogWhereInput[];
    id?: Prisma.StringFilter<"WorkoutLog"> | string;
    clientRequestId?: Prisma.StringNullableFilter<"WorkoutLog"> | string | null;
    userPlanId?: Prisma.StringFilter<"WorkoutLog"> | string;
    userId?: Prisma.StringFilter<"WorkoutLog"> | string;
    workoutPlanId?: Prisma.StringFilter<"WorkoutLog"> | string;
    trainingDayId?: Prisma.StringFilter<"WorkoutLog"> | string;
    date?: Prisma.DateTimeFilter<"WorkoutLog"> | Date | string;
    status?: Prisma.EnumWorkoutLogStatusFilter<"WorkoutLog"> | $Enums.WorkoutLogStatus;
    completedExercises?: Prisma.JsonFilter<"WorkoutLog">;
    createdAt?: Prisma.DateTimeFilter<"WorkoutLog"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"WorkoutLog"> | Date | string;
    userPlan?: Prisma.XOR<Prisma.UserWorkoutPlanScalarRelationFilter, Prisma.UserWorkoutPlanWhereInput>;
};
export type WorkoutLogOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    clientRequestId?: Prisma.SortOrderInput | Prisma.SortOrder;
    userPlanId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workoutPlanId?: Prisma.SortOrder;
    trainingDayId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    completedExercises?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    userPlan?: Prisma.UserWorkoutPlanOrderByWithRelationInput;
};
export type WorkoutLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    clientRequestId?: string;
    AND?: Prisma.WorkoutLogWhereInput | Prisma.WorkoutLogWhereInput[];
    OR?: Prisma.WorkoutLogWhereInput[];
    NOT?: Prisma.WorkoutLogWhereInput | Prisma.WorkoutLogWhereInput[];
    userPlanId?: Prisma.StringFilter<"WorkoutLog"> | string;
    userId?: Prisma.StringFilter<"WorkoutLog"> | string;
    workoutPlanId?: Prisma.StringFilter<"WorkoutLog"> | string;
    trainingDayId?: Prisma.StringFilter<"WorkoutLog"> | string;
    date?: Prisma.DateTimeFilter<"WorkoutLog"> | Date | string;
    status?: Prisma.EnumWorkoutLogStatusFilter<"WorkoutLog"> | $Enums.WorkoutLogStatus;
    completedExercises?: Prisma.JsonFilter<"WorkoutLog">;
    createdAt?: Prisma.DateTimeFilter<"WorkoutLog"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"WorkoutLog"> | Date | string;
    userPlan?: Prisma.XOR<Prisma.UserWorkoutPlanScalarRelationFilter, Prisma.UserWorkoutPlanWhereInput>;
}, "id" | "clientRequestId">;
export type WorkoutLogOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    clientRequestId?: Prisma.SortOrderInput | Prisma.SortOrder;
    userPlanId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workoutPlanId?: Prisma.SortOrder;
    trainingDayId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    completedExercises?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.WorkoutLogCountOrderByAggregateInput;
    _max?: Prisma.WorkoutLogMaxOrderByAggregateInput;
    _min?: Prisma.WorkoutLogMinOrderByAggregateInput;
};
export type WorkoutLogScalarWhereWithAggregatesInput = {
    AND?: Prisma.WorkoutLogScalarWhereWithAggregatesInput | Prisma.WorkoutLogScalarWhereWithAggregatesInput[];
    OR?: Prisma.WorkoutLogScalarWhereWithAggregatesInput[];
    NOT?: Prisma.WorkoutLogScalarWhereWithAggregatesInput | Prisma.WorkoutLogScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"WorkoutLog"> | string;
    clientRequestId?: Prisma.StringNullableWithAggregatesFilter<"WorkoutLog"> | string | null;
    userPlanId?: Prisma.StringWithAggregatesFilter<"WorkoutLog"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"WorkoutLog"> | string;
    workoutPlanId?: Prisma.StringWithAggregatesFilter<"WorkoutLog"> | string;
    trainingDayId?: Prisma.StringWithAggregatesFilter<"WorkoutLog"> | string;
    date?: Prisma.DateTimeWithAggregatesFilter<"WorkoutLog"> | Date | string;
    status?: Prisma.EnumWorkoutLogStatusWithAggregatesFilter<"WorkoutLog"> | $Enums.WorkoutLogStatus;
    completedExercises?: Prisma.JsonWithAggregatesFilter<"WorkoutLog">;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"WorkoutLog"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"WorkoutLog"> | Date | string;
};
export type WorkoutLogCreateInput = {
    id?: string;
    clientRequestId?: string | null;
    userId: string;
    workoutPlanId: string;
    trainingDayId: string;
    date: Date | string;
    status: $Enums.WorkoutLogStatus;
    completedExercises: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    userPlan: Prisma.UserWorkoutPlanCreateNestedOneWithoutLogsInput;
};
export type WorkoutLogUncheckedCreateInput = {
    id?: string;
    clientRequestId?: string | null;
    userPlanId: string;
    userId: string;
    workoutPlanId: string;
    trainingDayId: string;
    date: Date | string;
    status: $Enums.WorkoutLogStatus;
    completedExercises: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type WorkoutLogUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clientRequestId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workoutPlanId?: Prisma.StringFieldUpdateOperationsInput | string;
    trainingDayId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumWorkoutLogStatusFieldUpdateOperationsInput | $Enums.WorkoutLogStatus;
    completedExercises?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    userPlan?: Prisma.UserWorkoutPlanUpdateOneRequiredWithoutLogsNestedInput;
};
export type WorkoutLogUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clientRequestId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userPlanId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workoutPlanId?: Prisma.StringFieldUpdateOperationsInput | string;
    trainingDayId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumWorkoutLogStatusFieldUpdateOperationsInput | $Enums.WorkoutLogStatus;
    completedExercises?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkoutLogCreateManyInput = {
    id?: string;
    clientRequestId?: string | null;
    userPlanId: string;
    userId: string;
    workoutPlanId: string;
    trainingDayId: string;
    date: Date | string;
    status: $Enums.WorkoutLogStatus;
    completedExercises: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type WorkoutLogUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clientRequestId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workoutPlanId?: Prisma.StringFieldUpdateOperationsInput | string;
    trainingDayId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumWorkoutLogStatusFieldUpdateOperationsInput | $Enums.WorkoutLogStatus;
    completedExercises?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkoutLogUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clientRequestId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userPlanId?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workoutPlanId?: Prisma.StringFieldUpdateOperationsInput | string;
    trainingDayId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumWorkoutLogStatusFieldUpdateOperationsInput | $Enums.WorkoutLogStatus;
    completedExercises?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkoutLogListRelationFilter = {
    every?: Prisma.WorkoutLogWhereInput;
    some?: Prisma.WorkoutLogWhereInput;
    none?: Prisma.WorkoutLogWhereInput;
};
export type WorkoutLogOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type WorkoutLogCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    clientRequestId?: Prisma.SortOrder;
    userPlanId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workoutPlanId?: Prisma.SortOrder;
    trainingDayId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    completedExercises?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WorkoutLogMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    clientRequestId?: Prisma.SortOrder;
    userPlanId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workoutPlanId?: Prisma.SortOrder;
    trainingDayId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WorkoutLogMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    clientRequestId?: Prisma.SortOrder;
    userPlanId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    workoutPlanId?: Prisma.SortOrder;
    trainingDayId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WorkoutLogCreateNestedManyWithoutUserPlanInput = {
    create?: Prisma.XOR<Prisma.WorkoutLogCreateWithoutUserPlanInput, Prisma.WorkoutLogUncheckedCreateWithoutUserPlanInput> | Prisma.WorkoutLogCreateWithoutUserPlanInput[] | Prisma.WorkoutLogUncheckedCreateWithoutUserPlanInput[];
    connectOrCreate?: Prisma.WorkoutLogCreateOrConnectWithoutUserPlanInput | Prisma.WorkoutLogCreateOrConnectWithoutUserPlanInput[];
    createMany?: Prisma.WorkoutLogCreateManyUserPlanInputEnvelope;
    connect?: Prisma.WorkoutLogWhereUniqueInput | Prisma.WorkoutLogWhereUniqueInput[];
};
export type WorkoutLogUncheckedCreateNestedManyWithoutUserPlanInput = {
    create?: Prisma.XOR<Prisma.WorkoutLogCreateWithoutUserPlanInput, Prisma.WorkoutLogUncheckedCreateWithoutUserPlanInput> | Prisma.WorkoutLogCreateWithoutUserPlanInput[] | Prisma.WorkoutLogUncheckedCreateWithoutUserPlanInput[];
    connectOrCreate?: Prisma.WorkoutLogCreateOrConnectWithoutUserPlanInput | Prisma.WorkoutLogCreateOrConnectWithoutUserPlanInput[];
    createMany?: Prisma.WorkoutLogCreateManyUserPlanInputEnvelope;
    connect?: Prisma.WorkoutLogWhereUniqueInput | Prisma.WorkoutLogWhereUniqueInput[];
};
export type WorkoutLogUpdateManyWithoutUserPlanNestedInput = {
    create?: Prisma.XOR<Prisma.WorkoutLogCreateWithoutUserPlanInput, Prisma.WorkoutLogUncheckedCreateWithoutUserPlanInput> | Prisma.WorkoutLogCreateWithoutUserPlanInput[] | Prisma.WorkoutLogUncheckedCreateWithoutUserPlanInput[];
    connectOrCreate?: Prisma.WorkoutLogCreateOrConnectWithoutUserPlanInput | Prisma.WorkoutLogCreateOrConnectWithoutUserPlanInput[];
    upsert?: Prisma.WorkoutLogUpsertWithWhereUniqueWithoutUserPlanInput | Prisma.WorkoutLogUpsertWithWhereUniqueWithoutUserPlanInput[];
    createMany?: Prisma.WorkoutLogCreateManyUserPlanInputEnvelope;
    set?: Prisma.WorkoutLogWhereUniqueInput | Prisma.WorkoutLogWhereUniqueInput[];
    disconnect?: Prisma.WorkoutLogWhereUniqueInput | Prisma.WorkoutLogWhereUniqueInput[];
    delete?: Prisma.WorkoutLogWhereUniqueInput | Prisma.WorkoutLogWhereUniqueInput[];
    connect?: Prisma.WorkoutLogWhereUniqueInput | Prisma.WorkoutLogWhereUniqueInput[];
    update?: Prisma.WorkoutLogUpdateWithWhereUniqueWithoutUserPlanInput | Prisma.WorkoutLogUpdateWithWhereUniqueWithoutUserPlanInput[];
    updateMany?: Prisma.WorkoutLogUpdateManyWithWhereWithoutUserPlanInput | Prisma.WorkoutLogUpdateManyWithWhereWithoutUserPlanInput[];
    deleteMany?: Prisma.WorkoutLogScalarWhereInput | Prisma.WorkoutLogScalarWhereInput[];
};
export type WorkoutLogUncheckedUpdateManyWithoutUserPlanNestedInput = {
    create?: Prisma.XOR<Prisma.WorkoutLogCreateWithoutUserPlanInput, Prisma.WorkoutLogUncheckedCreateWithoutUserPlanInput> | Prisma.WorkoutLogCreateWithoutUserPlanInput[] | Prisma.WorkoutLogUncheckedCreateWithoutUserPlanInput[];
    connectOrCreate?: Prisma.WorkoutLogCreateOrConnectWithoutUserPlanInput | Prisma.WorkoutLogCreateOrConnectWithoutUserPlanInput[];
    upsert?: Prisma.WorkoutLogUpsertWithWhereUniqueWithoutUserPlanInput | Prisma.WorkoutLogUpsertWithWhereUniqueWithoutUserPlanInput[];
    createMany?: Prisma.WorkoutLogCreateManyUserPlanInputEnvelope;
    set?: Prisma.WorkoutLogWhereUniqueInput | Prisma.WorkoutLogWhereUniqueInput[];
    disconnect?: Prisma.WorkoutLogWhereUniqueInput | Prisma.WorkoutLogWhereUniqueInput[];
    delete?: Prisma.WorkoutLogWhereUniqueInput | Prisma.WorkoutLogWhereUniqueInput[];
    connect?: Prisma.WorkoutLogWhereUniqueInput | Prisma.WorkoutLogWhereUniqueInput[];
    update?: Prisma.WorkoutLogUpdateWithWhereUniqueWithoutUserPlanInput | Prisma.WorkoutLogUpdateWithWhereUniqueWithoutUserPlanInput[];
    updateMany?: Prisma.WorkoutLogUpdateManyWithWhereWithoutUserPlanInput | Prisma.WorkoutLogUpdateManyWithWhereWithoutUserPlanInput[];
    deleteMany?: Prisma.WorkoutLogScalarWhereInput | Prisma.WorkoutLogScalarWhereInput[];
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type EnumWorkoutLogStatusFieldUpdateOperationsInput = {
    set?: $Enums.WorkoutLogStatus;
};
export type WorkoutLogCreateWithoutUserPlanInput = {
    id?: string;
    clientRequestId?: string | null;
    userId: string;
    workoutPlanId: string;
    trainingDayId: string;
    date: Date | string;
    status: $Enums.WorkoutLogStatus;
    completedExercises: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type WorkoutLogUncheckedCreateWithoutUserPlanInput = {
    id?: string;
    clientRequestId?: string | null;
    userId: string;
    workoutPlanId: string;
    trainingDayId: string;
    date: Date | string;
    status: $Enums.WorkoutLogStatus;
    completedExercises: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type WorkoutLogCreateOrConnectWithoutUserPlanInput = {
    where: Prisma.WorkoutLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkoutLogCreateWithoutUserPlanInput, Prisma.WorkoutLogUncheckedCreateWithoutUserPlanInput>;
};
export type WorkoutLogCreateManyUserPlanInputEnvelope = {
    data: Prisma.WorkoutLogCreateManyUserPlanInput | Prisma.WorkoutLogCreateManyUserPlanInput[];
};
export type WorkoutLogUpsertWithWhereUniqueWithoutUserPlanInput = {
    where: Prisma.WorkoutLogWhereUniqueInput;
    update: Prisma.XOR<Prisma.WorkoutLogUpdateWithoutUserPlanInput, Prisma.WorkoutLogUncheckedUpdateWithoutUserPlanInput>;
    create: Prisma.XOR<Prisma.WorkoutLogCreateWithoutUserPlanInput, Prisma.WorkoutLogUncheckedCreateWithoutUserPlanInput>;
};
export type WorkoutLogUpdateWithWhereUniqueWithoutUserPlanInput = {
    where: Prisma.WorkoutLogWhereUniqueInput;
    data: Prisma.XOR<Prisma.WorkoutLogUpdateWithoutUserPlanInput, Prisma.WorkoutLogUncheckedUpdateWithoutUserPlanInput>;
};
export type WorkoutLogUpdateManyWithWhereWithoutUserPlanInput = {
    where: Prisma.WorkoutLogScalarWhereInput;
    data: Prisma.XOR<Prisma.WorkoutLogUpdateManyMutationInput, Prisma.WorkoutLogUncheckedUpdateManyWithoutUserPlanInput>;
};
export type WorkoutLogScalarWhereInput = {
    AND?: Prisma.WorkoutLogScalarWhereInput | Prisma.WorkoutLogScalarWhereInput[];
    OR?: Prisma.WorkoutLogScalarWhereInput[];
    NOT?: Prisma.WorkoutLogScalarWhereInput | Prisma.WorkoutLogScalarWhereInput[];
    id?: Prisma.StringFilter<"WorkoutLog"> | string;
    clientRequestId?: Prisma.StringNullableFilter<"WorkoutLog"> | string | null;
    userPlanId?: Prisma.StringFilter<"WorkoutLog"> | string;
    userId?: Prisma.StringFilter<"WorkoutLog"> | string;
    workoutPlanId?: Prisma.StringFilter<"WorkoutLog"> | string;
    trainingDayId?: Prisma.StringFilter<"WorkoutLog"> | string;
    date?: Prisma.DateTimeFilter<"WorkoutLog"> | Date | string;
    status?: Prisma.EnumWorkoutLogStatusFilter<"WorkoutLog"> | $Enums.WorkoutLogStatus;
    completedExercises?: Prisma.JsonFilter<"WorkoutLog">;
    createdAt?: Prisma.DateTimeFilter<"WorkoutLog"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"WorkoutLog"> | Date | string;
};
export type WorkoutLogCreateManyUserPlanInput = {
    id?: string;
    clientRequestId?: string | null;
    userId: string;
    workoutPlanId: string;
    trainingDayId: string;
    date: Date | string;
    status: $Enums.WorkoutLogStatus;
    completedExercises: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type WorkoutLogUpdateWithoutUserPlanInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clientRequestId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workoutPlanId?: Prisma.StringFieldUpdateOperationsInput | string;
    trainingDayId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumWorkoutLogStatusFieldUpdateOperationsInput | $Enums.WorkoutLogStatus;
    completedExercises?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkoutLogUncheckedUpdateWithoutUserPlanInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clientRequestId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workoutPlanId?: Prisma.StringFieldUpdateOperationsInput | string;
    trainingDayId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumWorkoutLogStatusFieldUpdateOperationsInput | $Enums.WorkoutLogStatus;
    completedExercises?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkoutLogUncheckedUpdateManyWithoutUserPlanInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    clientRequestId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    workoutPlanId?: Prisma.StringFieldUpdateOperationsInput | string;
    trainingDayId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    status?: Prisma.EnumWorkoutLogStatusFieldUpdateOperationsInput | $Enums.WorkoutLogStatus;
    completedExercises?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkoutLogSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    clientRequestId?: boolean;
    userPlanId?: boolean;
    userId?: boolean;
    workoutPlanId?: boolean;
    trainingDayId?: boolean;
    date?: boolean;
    status?: boolean;
    completedExercises?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    userPlan?: boolean | Prisma.UserWorkoutPlanDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workoutLog"]>;
export type WorkoutLogSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    clientRequestId?: boolean;
    userPlanId?: boolean;
    userId?: boolean;
    workoutPlanId?: boolean;
    trainingDayId?: boolean;
    date?: boolean;
    status?: boolean;
    completedExercises?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    userPlan?: boolean | Prisma.UserWorkoutPlanDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workoutLog"]>;
export type WorkoutLogSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    clientRequestId?: boolean;
    userPlanId?: boolean;
    userId?: boolean;
    workoutPlanId?: boolean;
    trainingDayId?: boolean;
    date?: boolean;
    status?: boolean;
    completedExercises?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    userPlan?: boolean | Prisma.UserWorkoutPlanDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workoutLog"]>;
export type WorkoutLogSelectScalar = {
    id?: boolean;
    clientRequestId?: boolean;
    userPlanId?: boolean;
    userId?: boolean;
    workoutPlanId?: boolean;
    trainingDayId?: boolean;
    date?: boolean;
    status?: boolean;
    completedExercises?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type WorkoutLogOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "clientRequestId" | "userPlanId" | "userId" | "workoutPlanId" | "trainingDayId" | "date" | "status" | "completedExercises" | "createdAt" | "updatedAt", ExtArgs["result"]["workoutLog"]>;
export type WorkoutLogInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    userPlan?: boolean | Prisma.UserWorkoutPlanDefaultArgs<ExtArgs>;
};
export type WorkoutLogIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    userPlan?: boolean | Prisma.UserWorkoutPlanDefaultArgs<ExtArgs>;
};
export type WorkoutLogIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    userPlan?: boolean | Prisma.UserWorkoutPlanDefaultArgs<ExtArgs>;
};
export type $WorkoutLogPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "WorkoutLog";
    objects: {
        userPlan: Prisma.$UserWorkoutPlanPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        clientRequestId: string | null;
        userPlanId: string;
        userId: string;
        workoutPlanId: string;
        trainingDayId: string;
        date: Date;
        status: $Enums.WorkoutLogStatus;
        completedExercises: runtime.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["workoutLog"]>;
    composites: {};
};
export type WorkoutLogGetPayload<S extends boolean | null | undefined | WorkoutLogDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$WorkoutLogPayload, S>;
export type WorkoutLogCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<WorkoutLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: WorkoutLogCountAggregateInputType | true;
};
export interface WorkoutLogDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['WorkoutLog'];
        meta: {
            name: 'WorkoutLog';
        };
    };
    findUnique<T extends WorkoutLogFindUniqueArgs>(args: Prisma.SelectSubset<T, WorkoutLogFindUniqueArgs<ExtArgs>>): Prisma.Prisma__WorkoutLogClient<runtime.Types.Result.GetResult<Prisma.$WorkoutLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends WorkoutLogFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, WorkoutLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkoutLogClient<runtime.Types.Result.GetResult<Prisma.$WorkoutLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends WorkoutLogFindFirstArgs>(args?: Prisma.SelectSubset<T, WorkoutLogFindFirstArgs<ExtArgs>>): Prisma.Prisma__WorkoutLogClient<runtime.Types.Result.GetResult<Prisma.$WorkoutLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends WorkoutLogFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, WorkoutLogFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkoutLogClient<runtime.Types.Result.GetResult<Prisma.$WorkoutLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends WorkoutLogFindManyArgs>(args?: Prisma.SelectSubset<T, WorkoutLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkoutLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends WorkoutLogCreateArgs>(args: Prisma.SelectSubset<T, WorkoutLogCreateArgs<ExtArgs>>): Prisma.Prisma__WorkoutLogClient<runtime.Types.Result.GetResult<Prisma.$WorkoutLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends WorkoutLogCreateManyArgs>(args?: Prisma.SelectSubset<T, WorkoutLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends WorkoutLogCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, WorkoutLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkoutLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends WorkoutLogDeleteArgs>(args: Prisma.SelectSubset<T, WorkoutLogDeleteArgs<ExtArgs>>): Prisma.Prisma__WorkoutLogClient<runtime.Types.Result.GetResult<Prisma.$WorkoutLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends WorkoutLogUpdateArgs>(args: Prisma.SelectSubset<T, WorkoutLogUpdateArgs<ExtArgs>>): Prisma.Prisma__WorkoutLogClient<runtime.Types.Result.GetResult<Prisma.$WorkoutLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends WorkoutLogDeleteManyArgs>(args?: Prisma.SelectSubset<T, WorkoutLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends WorkoutLogUpdateManyArgs>(args: Prisma.SelectSubset<T, WorkoutLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends WorkoutLogUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, WorkoutLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkoutLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends WorkoutLogUpsertArgs>(args: Prisma.SelectSubset<T, WorkoutLogUpsertArgs<ExtArgs>>): Prisma.Prisma__WorkoutLogClient<runtime.Types.Result.GetResult<Prisma.$WorkoutLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends WorkoutLogCountArgs>(args?: Prisma.Subset<T, WorkoutLogCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], WorkoutLogCountAggregateOutputType> : number>;
    aggregate<T extends WorkoutLogAggregateArgs>(args: Prisma.Subset<T, WorkoutLogAggregateArgs>): Prisma.PrismaPromise<GetWorkoutLogAggregateType<T>>;
    groupBy<T extends WorkoutLogGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: WorkoutLogGroupByArgs['orderBy'];
    } : {
        orderBy?: WorkoutLogGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, WorkoutLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkoutLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: WorkoutLogFieldRefs;
}
export interface Prisma__WorkoutLogClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    userPlan<T extends Prisma.UserWorkoutPlanDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserWorkoutPlanDefaultArgs<ExtArgs>>): Prisma.Prisma__UserWorkoutPlanClient<runtime.Types.Result.GetResult<Prisma.$UserWorkoutPlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface WorkoutLogFieldRefs {
    readonly id: Prisma.FieldRef<"WorkoutLog", 'String'>;
    readonly clientRequestId: Prisma.FieldRef<"WorkoutLog", 'String'>;
    readonly userPlanId: Prisma.FieldRef<"WorkoutLog", 'String'>;
    readonly userId: Prisma.FieldRef<"WorkoutLog", 'String'>;
    readonly workoutPlanId: Prisma.FieldRef<"WorkoutLog", 'String'>;
    readonly trainingDayId: Prisma.FieldRef<"WorkoutLog", 'String'>;
    readonly date: Prisma.FieldRef<"WorkoutLog", 'DateTime'>;
    readonly status: Prisma.FieldRef<"WorkoutLog", 'WorkoutLogStatus'>;
    readonly completedExercises: Prisma.FieldRef<"WorkoutLog", 'Json'>;
    readonly createdAt: Prisma.FieldRef<"WorkoutLog", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"WorkoutLog", 'DateTime'>;
}
export type WorkoutLogFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutLogSelect<ExtArgs> | null;
    omit?: Prisma.WorkoutLogOmit<ExtArgs> | null;
    include?: Prisma.WorkoutLogInclude<ExtArgs> | null;
    where: Prisma.WorkoutLogWhereUniqueInput;
};
export type WorkoutLogFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutLogSelect<ExtArgs> | null;
    omit?: Prisma.WorkoutLogOmit<ExtArgs> | null;
    include?: Prisma.WorkoutLogInclude<ExtArgs> | null;
    where: Prisma.WorkoutLogWhereUniqueInput;
};
export type WorkoutLogFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type WorkoutLogFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type WorkoutLogFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type WorkoutLogCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutLogSelect<ExtArgs> | null;
    omit?: Prisma.WorkoutLogOmit<ExtArgs> | null;
    include?: Prisma.WorkoutLogInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkoutLogCreateInput, Prisma.WorkoutLogUncheckedCreateInput>;
};
export type WorkoutLogCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.WorkoutLogCreateManyInput | Prisma.WorkoutLogCreateManyInput[];
};
export type WorkoutLogCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutLogSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WorkoutLogOmit<ExtArgs> | null;
    data: Prisma.WorkoutLogCreateManyInput | Prisma.WorkoutLogCreateManyInput[];
    include?: Prisma.WorkoutLogIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type WorkoutLogUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutLogSelect<ExtArgs> | null;
    omit?: Prisma.WorkoutLogOmit<ExtArgs> | null;
    include?: Prisma.WorkoutLogInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkoutLogUpdateInput, Prisma.WorkoutLogUncheckedUpdateInput>;
    where: Prisma.WorkoutLogWhereUniqueInput;
};
export type WorkoutLogUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.WorkoutLogUpdateManyMutationInput, Prisma.WorkoutLogUncheckedUpdateManyInput>;
    where?: Prisma.WorkoutLogWhereInput;
    limit?: number;
};
export type WorkoutLogUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutLogSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WorkoutLogOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkoutLogUpdateManyMutationInput, Prisma.WorkoutLogUncheckedUpdateManyInput>;
    where?: Prisma.WorkoutLogWhereInput;
    limit?: number;
    include?: Prisma.WorkoutLogIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type WorkoutLogUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutLogSelect<ExtArgs> | null;
    omit?: Prisma.WorkoutLogOmit<ExtArgs> | null;
    include?: Prisma.WorkoutLogInclude<ExtArgs> | null;
    where: Prisma.WorkoutLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkoutLogCreateInput, Prisma.WorkoutLogUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.WorkoutLogUpdateInput, Prisma.WorkoutLogUncheckedUpdateInput>;
};
export type WorkoutLogDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutLogSelect<ExtArgs> | null;
    omit?: Prisma.WorkoutLogOmit<ExtArgs> | null;
    include?: Prisma.WorkoutLogInclude<ExtArgs> | null;
    where: Prisma.WorkoutLogWhereUniqueInput;
};
export type WorkoutLogDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkoutLogWhereInput;
    limit?: number;
};
export type WorkoutLogDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutLogSelect<ExtArgs> | null;
    omit?: Prisma.WorkoutLogOmit<ExtArgs> | null;
    include?: Prisma.WorkoutLogInclude<ExtArgs> | null;
};
