import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type WorkoutPlanModel = runtime.Types.Result.DefaultSelection<Prisma.$WorkoutPlanPayload>;
export type AggregateWorkoutPlan = {
    _count: WorkoutPlanCountAggregateOutputType | null;
    _min: WorkoutPlanMinAggregateOutputType | null;
    _max: WorkoutPlanMaxAggregateOutputType | null;
};
export type WorkoutPlanMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type WorkoutPlanMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type WorkoutPlanCountAggregateOutputType = {
    id: number;
    name: number;
    description: number;
    schedule: number;
    trainingDays: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type WorkoutPlanMinAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type WorkoutPlanMaxAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type WorkoutPlanCountAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    schedule?: true;
    trainingDays?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type WorkoutPlanAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkoutPlanWhereInput;
    orderBy?: Prisma.WorkoutPlanOrderByWithRelationInput | Prisma.WorkoutPlanOrderByWithRelationInput[];
    cursor?: Prisma.WorkoutPlanWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | WorkoutPlanCountAggregateInputType;
    _min?: WorkoutPlanMinAggregateInputType;
    _max?: WorkoutPlanMaxAggregateInputType;
};
export type GetWorkoutPlanAggregateType<T extends WorkoutPlanAggregateArgs> = {
    [P in keyof T & keyof AggregateWorkoutPlan]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWorkoutPlan[P]> : Prisma.GetScalarType<T[P], AggregateWorkoutPlan[P]>;
};
export type WorkoutPlanGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkoutPlanWhereInput;
    orderBy?: Prisma.WorkoutPlanOrderByWithAggregationInput | Prisma.WorkoutPlanOrderByWithAggregationInput[];
    by: Prisma.WorkoutPlanScalarFieldEnum[] | Prisma.WorkoutPlanScalarFieldEnum;
    having?: Prisma.WorkoutPlanScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WorkoutPlanCountAggregateInputType | true;
    _min?: WorkoutPlanMinAggregateInputType;
    _max?: WorkoutPlanMaxAggregateInputType;
};
export type WorkoutPlanGroupByOutputType = {
    id: string;
    name: string;
    description: string;
    schedule: runtime.JsonValue | null;
    trainingDays: runtime.JsonValue | null;
    createdAt: Date;
    updatedAt: Date;
    _count: WorkoutPlanCountAggregateOutputType | null;
    _min: WorkoutPlanMinAggregateOutputType | null;
    _max: WorkoutPlanMaxAggregateOutputType | null;
};
export type GetWorkoutPlanGroupByPayload<T extends WorkoutPlanGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<WorkoutPlanGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof WorkoutPlanGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], WorkoutPlanGroupByOutputType[P]> : Prisma.GetScalarType<T[P], WorkoutPlanGroupByOutputType[P]>;
}>>;
export type WorkoutPlanWhereInput = {
    AND?: Prisma.WorkoutPlanWhereInput | Prisma.WorkoutPlanWhereInput[];
    OR?: Prisma.WorkoutPlanWhereInput[];
    NOT?: Prisma.WorkoutPlanWhereInput | Prisma.WorkoutPlanWhereInput[];
    id?: Prisma.StringFilter<"WorkoutPlan"> | string;
    name?: Prisma.StringFilter<"WorkoutPlan"> | string;
    description?: Prisma.StringFilter<"WorkoutPlan"> | string;
    schedule?: Prisma.JsonNullableFilter<"WorkoutPlan">;
    trainingDays?: Prisma.JsonNullableFilter<"WorkoutPlan">;
    createdAt?: Prisma.DateTimeFilter<"WorkoutPlan"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"WorkoutPlan"> | Date | string;
};
export type WorkoutPlanOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    schedule?: Prisma.SortOrderInput | Prisma.SortOrder;
    trainingDays?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WorkoutPlanWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.WorkoutPlanWhereInput | Prisma.WorkoutPlanWhereInput[];
    OR?: Prisma.WorkoutPlanWhereInput[];
    NOT?: Prisma.WorkoutPlanWhereInput | Prisma.WorkoutPlanWhereInput[];
    name?: Prisma.StringFilter<"WorkoutPlan"> | string;
    description?: Prisma.StringFilter<"WorkoutPlan"> | string;
    schedule?: Prisma.JsonNullableFilter<"WorkoutPlan">;
    trainingDays?: Prisma.JsonNullableFilter<"WorkoutPlan">;
    createdAt?: Prisma.DateTimeFilter<"WorkoutPlan"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"WorkoutPlan"> | Date | string;
}, "id">;
export type WorkoutPlanOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    schedule?: Prisma.SortOrderInput | Prisma.SortOrder;
    trainingDays?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.WorkoutPlanCountOrderByAggregateInput;
    _max?: Prisma.WorkoutPlanMaxOrderByAggregateInput;
    _min?: Prisma.WorkoutPlanMinOrderByAggregateInput;
};
export type WorkoutPlanScalarWhereWithAggregatesInput = {
    AND?: Prisma.WorkoutPlanScalarWhereWithAggregatesInput | Prisma.WorkoutPlanScalarWhereWithAggregatesInput[];
    OR?: Prisma.WorkoutPlanScalarWhereWithAggregatesInput[];
    NOT?: Prisma.WorkoutPlanScalarWhereWithAggregatesInput | Prisma.WorkoutPlanScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"WorkoutPlan"> | string;
    name?: Prisma.StringWithAggregatesFilter<"WorkoutPlan"> | string;
    description?: Prisma.StringWithAggregatesFilter<"WorkoutPlan"> | string;
    schedule?: Prisma.JsonNullableWithAggregatesFilter<"WorkoutPlan">;
    trainingDays?: Prisma.JsonNullableWithAggregatesFilter<"WorkoutPlan">;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"WorkoutPlan"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"WorkoutPlan"> | Date | string;
};
export type WorkoutPlanCreateInput = {
    id?: string;
    name: string;
    description: string;
    schedule?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    trainingDays?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type WorkoutPlanUncheckedCreateInput = {
    id?: string;
    name: string;
    description: string;
    schedule?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    trainingDays?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type WorkoutPlanUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    schedule?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    trainingDays?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkoutPlanUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    schedule?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    trainingDays?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkoutPlanCreateManyInput = {
    id?: string;
    name: string;
    description: string;
    schedule?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    trainingDays?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type WorkoutPlanUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    schedule?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    trainingDays?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkoutPlanUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    schedule?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    trainingDays?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkoutPlanCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    schedule?: Prisma.SortOrder;
    trainingDays?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WorkoutPlanMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WorkoutPlanMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type WorkoutPlanSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    schedule?: boolean;
    trainingDays?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["workoutPlan"]>;
export type WorkoutPlanSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    schedule?: boolean;
    trainingDays?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["workoutPlan"]>;
export type WorkoutPlanSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    schedule?: boolean;
    trainingDays?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["workoutPlan"]>;
export type WorkoutPlanSelectScalar = {
    id?: boolean;
    name?: boolean;
    description?: boolean;
    schedule?: boolean;
    trainingDays?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type WorkoutPlanOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "description" | "schedule" | "trainingDays" | "createdAt" | "updatedAt", ExtArgs["result"]["workoutPlan"]>;
export type $WorkoutPlanPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "WorkoutPlan";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        description: string;
        schedule: runtime.JsonValue | null;
        trainingDays: runtime.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["workoutPlan"]>;
    composites: {};
};
export type WorkoutPlanGetPayload<S extends boolean | null | undefined | WorkoutPlanDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$WorkoutPlanPayload, S>;
export type WorkoutPlanCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<WorkoutPlanFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: WorkoutPlanCountAggregateInputType | true;
};
export interface WorkoutPlanDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['WorkoutPlan'];
        meta: {
            name: 'WorkoutPlan';
        };
    };
    findUnique<T extends WorkoutPlanFindUniqueArgs>(args: Prisma.SelectSubset<T, WorkoutPlanFindUniqueArgs<ExtArgs>>): Prisma.Prisma__WorkoutPlanClient<runtime.Types.Result.GetResult<Prisma.$WorkoutPlanPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends WorkoutPlanFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, WorkoutPlanFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkoutPlanClient<runtime.Types.Result.GetResult<Prisma.$WorkoutPlanPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends WorkoutPlanFindFirstArgs>(args?: Prisma.SelectSubset<T, WorkoutPlanFindFirstArgs<ExtArgs>>): Prisma.Prisma__WorkoutPlanClient<runtime.Types.Result.GetResult<Prisma.$WorkoutPlanPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends WorkoutPlanFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, WorkoutPlanFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkoutPlanClient<runtime.Types.Result.GetResult<Prisma.$WorkoutPlanPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends WorkoutPlanFindManyArgs>(args?: Prisma.SelectSubset<T, WorkoutPlanFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkoutPlanPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends WorkoutPlanCreateArgs>(args: Prisma.SelectSubset<T, WorkoutPlanCreateArgs<ExtArgs>>): Prisma.Prisma__WorkoutPlanClient<runtime.Types.Result.GetResult<Prisma.$WorkoutPlanPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends WorkoutPlanCreateManyArgs>(args?: Prisma.SelectSubset<T, WorkoutPlanCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends WorkoutPlanCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, WorkoutPlanCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkoutPlanPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends WorkoutPlanDeleteArgs>(args: Prisma.SelectSubset<T, WorkoutPlanDeleteArgs<ExtArgs>>): Prisma.Prisma__WorkoutPlanClient<runtime.Types.Result.GetResult<Prisma.$WorkoutPlanPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends WorkoutPlanUpdateArgs>(args: Prisma.SelectSubset<T, WorkoutPlanUpdateArgs<ExtArgs>>): Prisma.Prisma__WorkoutPlanClient<runtime.Types.Result.GetResult<Prisma.$WorkoutPlanPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends WorkoutPlanDeleteManyArgs>(args?: Prisma.SelectSubset<T, WorkoutPlanDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends WorkoutPlanUpdateManyArgs>(args: Prisma.SelectSubset<T, WorkoutPlanUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends WorkoutPlanUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, WorkoutPlanUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkoutPlanPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends WorkoutPlanUpsertArgs>(args: Prisma.SelectSubset<T, WorkoutPlanUpsertArgs<ExtArgs>>): Prisma.Prisma__WorkoutPlanClient<runtime.Types.Result.GetResult<Prisma.$WorkoutPlanPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends WorkoutPlanCountArgs>(args?: Prisma.Subset<T, WorkoutPlanCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], WorkoutPlanCountAggregateOutputType> : number>;
    aggregate<T extends WorkoutPlanAggregateArgs>(args: Prisma.Subset<T, WorkoutPlanAggregateArgs>): Prisma.PrismaPromise<GetWorkoutPlanAggregateType<T>>;
    groupBy<T extends WorkoutPlanGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: WorkoutPlanGroupByArgs['orderBy'];
    } : {
        orderBy?: WorkoutPlanGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, WorkoutPlanGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkoutPlanGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: WorkoutPlanFieldRefs;
}
export interface Prisma__WorkoutPlanClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface WorkoutPlanFieldRefs {
    readonly id: Prisma.FieldRef<"WorkoutPlan", 'String'>;
    readonly name: Prisma.FieldRef<"WorkoutPlan", 'String'>;
    readonly description: Prisma.FieldRef<"WorkoutPlan", 'String'>;
    readonly schedule: Prisma.FieldRef<"WorkoutPlan", 'Json'>;
    readonly trainingDays: Prisma.FieldRef<"WorkoutPlan", 'Json'>;
    readonly createdAt: Prisma.FieldRef<"WorkoutPlan", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"WorkoutPlan", 'DateTime'>;
}
export type WorkoutPlanFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.WorkoutPlanOmit<ExtArgs> | null;
    where: Prisma.WorkoutPlanWhereUniqueInput;
};
export type WorkoutPlanFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.WorkoutPlanOmit<ExtArgs> | null;
    where: Prisma.WorkoutPlanWhereUniqueInput;
};
export type WorkoutPlanFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.WorkoutPlanOmit<ExtArgs> | null;
    where?: Prisma.WorkoutPlanWhereInput;
    orderBy?: Prisma.WorkoutPlanOrderByWithRelationInput | Prisma.WorkoutPlanOrderByWithRelationInput[];
    cursor?: Prisma.WorkoutPlanWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkoutPlanScalarFieldEnum | Prisma.WorkoutPlanScalarFieldEnum[];
};
export type WorkoutPlanFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.WorkoutPlanOmit<ExtArgs> | null;
    where?: Prisma.WorkoutPlanWhereInput;
    orderBy?: Prisma.WorkoutPlanOrderByWithRelationInput | Prisma.WorkoutPlanOrderByWithRelationInput[];
    cursor?: Prisma.WorkoutPlanWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkoutPlanScalarFieldEnum | Prisma.WorkoutPlanScalarFieldEnum[];
};
export type WorkoutPlanFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.WorkoutPlanOmit<ExtArgs> | null;
    where?: Prisma.WorkoutPlanWhereInput;
    orderBy?: Prisma.WorkoutPlanOrderByWithRelationInput | Prisma.WorkoutPlanOrderByWithRelationInput[];
    cursor?: Prisma.WorkoutPlanWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkoutPlanScalarFieldEnum | Prisma.WorkoutPlanScalarFieldEnum[];
};
export type WorkoutPlanCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.WorkoutPlanOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkoutPlanCreateInput, Prisma.WorkoutPlanUncheckedCreateInput>;
};
export type WorkoutPlanCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.WorkoutPlanCreateManyInput | Prisma.WorkoutPlanCreateManyInput[];
};
export type WorkoutPlanCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutPlanSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WorkoutPlanOmit<ExtArgs> | null;
    data: Prisma.WorkoutPlanCreateManyInput | Prisma.WorkoutPlanCreateManyInput[];
};
export type WorkoutPlanUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.WorkoutPlanOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkoutPlanUpdateInput, Prisma.WorkoutPlanUncheckedUpdateInput>;
    where: Prisma.WorkoutPlanWhereUniqueInput;
};
export type WorkoutPlanUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.WorkoutPlanUpdateManyMutationInput, Prisma.WorkoutPlanUncheckedUpdateManyInput>;
    where?: Prisma.WorkoutPlanWhereInput;
    limit?: number;
};
export type WorkoutPlanUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutPlanSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WorkoutPlanOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkoutPlanUpdateManyMutationInput, Prisma.WorkoutPlanUncheckedUpdateManyInput>;
    where?: Prisma.WorkoutPlanWhereInput;
    limit?: number;
};
export type WorkoutPlanUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.WorkoutPlanOmit<ExtArgs> | null;
    where: Prisma.WorkoutPlanWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkoutPlanCreateInput, Prisma.WorkoutPlanUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.WorkoutPlanUpdateInput, Prisma.WorkoutPlanUncheckedUpdateInput>;
};
export type WorkoutPlanDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.WorkoutPlanOmit<ExtArgs> | null;
    where: Prisma.WorkoutPlanWhereUniqueInput;
};
export type WorkoutPlanDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkoutPlanWhereInput;
    limit?: number;
};
export type WorkoutPlanDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkoutPlanSelect<ExtArgs> | null;
    omit?: Prisma.WorkoutPlanOmit<ExtArgs> | null;
};
