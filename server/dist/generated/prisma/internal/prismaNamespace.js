"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineExtension = exports.QueryMode = exports.JsonNullValueFilter = exports.NullsOrder = exports.JsonNullValueInput = exports.NullableJsonNullValueInput = exports.SortOrder = exports.WorkoutLogScalarFieldEnum = exports.WorkoutPlanScalarFieldEnum = exports.UserWorkoutPlanScalarFieldEnum = exports.AuthSessionScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
const runtime = require("@prisma/client/runtime/client");
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "7.8.0",
    engine: "3c6e192761c0362d496ed980de936e2f3cebcd3a"
};
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    User: 'User',
    AuthSession: 'AuthSession',
    UserWorkoutPlan: 'UserWorkoutPlan',
    WorkoutPlan: 'WorkoutPlan',
    WorkoutLog: 'WorkoutLog'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    Serializable: 'Serializable'
});
exports.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    username: 'username',
    displayName: 'displayName',
    passwordHash: 'passwordHash',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lastLoginAt: 'lastLoginAt'
};
exports.AuthSessionScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    tokenHash: 'tokenHash',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lastSeenAt: 'lastSeenAt'
};
exports.UserWorkoutPlanScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    workoutPlanId: 'workoutPlanId',
    startDate: 'startDate',
    currentDayIndex: 'currentDayIndex',
    status: 'status',
    isArchived: 'isArchived',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.WorkoutPlanScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    schedule: 'schedule',
    trainingDays: 'trainingDays',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.WorkoutLogScalarFieldEnum = {
    id: 'id',
    clientRequestId: 'clientRequestId',
    userPlanId: 'userPlanId',
    userId: 'userId',
    workoutPlanId: 'workoutPlanId',
    trainingDayId: 'trainingDayId',
    date: 'date',
    status: 'status',
    completedExercises: 'completedExercises',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.NullableJsonNullValueInput = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull
};
exports.JsonNullValueInput = {
    JsonNull: exports.JsonNull
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map