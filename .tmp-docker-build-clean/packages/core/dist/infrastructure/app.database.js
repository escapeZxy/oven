"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.AppDatabase = void 0;
var dexie_1 = require("dexie");
var AppDatabase = /** @class */ (function (_super) {
    __extends(AppDatabase, _super);
    function AppDatabase() {
        var _this = _super.call(this, 'OvenDB') || this;
        _this.version(2).stores({
            // Indexing strategy:
            // id: Primary Key
            // userId: Frequent query for user's plans
            // workoutPlanId: Query for specific plan types
            userWorkoutPlans: 'id, userId, workoutPlanId',
            // Indexing strategy:
            // id: Primary Key
            // userId: Frequent query for user's logs
            // *completedExercises.exerciseId: Multi-entry index for exercise lookup
            // date: For sorting
            workoutLogs: '++id, userId, *completedExercises.exerciseId, date',
        });
        return _this;
    }
    return AppDatabase;
}(dexie_1.default));
exports.AppDatabase = AppDatabase;
exports.db = new AppDatabase();
