"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DexieUserWorkoutPlanRepository = void 0;
var uuid_1 = require("uuid");
var app_database_1 = require("./app.database");
var DexieUserWorkoutPlanRepository = /** @class */ (function () {
    function DexieUserWorkoutPlanRepository() {
    }
    DexieUserWorkoutPlanRepository.prototype.create = function (planData) {
        return __awaiter(this, void 0, void 0, function () {
            var newPlan;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newPlan = __assign({ id: (0, uuid_1.v4)() }, planData);
                        return [4 /*yield*/, app_database_1.db.userWorkoutPlans.add(newPlan)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, newPlan];
                }
            });
        });
    };
    DexieUserWorkoutPlanRepository.prototype.findById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var plan;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_database_1.db.userWorkoutPlans.get(id)];
                    case 1:
                        plan = _a.sent();
                        return [2 /*return*/, plan || null];
                }
            });
        });
    };
    DexieUserWorkoutPlanRepository.prototype.findByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_database_1.db.userWorkoutPlans
                            .where('userId')
                            .equals(userId)
                            .toArray()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DexieUserWorkoutPlanRepository.prototype.findActiveByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var plans;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_database_1.db.userWorkoutPlans
                            .where('userId')
                            .equals(userId)
                            .filter(function (plan) { return plan.isActive; })
                            .toArray()];
                    case 1:
                        plans = _a.sent();
                        return [2 /*return*/, plans.length > 0 ? plans[0] : null];
                }
            });
        });
    };
    DexieUserWorkoutPlanRepository.prototype.update = function (plan) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // We use put() instead of update() because we are replacing the entire object.
                    // Also, update() type definition forbids passing the primary key in the changes object,
                    // which causes type errors since UserWorkoutPlan includes 'id'.
                    // put() handles "insert or update" semantics perfectly here.
                    return [4 /*yield*/, app_database_1.db.userWorkoutPlans.put(plan)];
                    case 1:
                        // We use put() instead of update() because we are replacing the entire object.
                        // Also, update() type definition forbids passing the primary key in the changes object,
                        // which causes type errors since UserWorkoutPlan includes 'id'.
                        // put() handles "insert or update" semantics perfectly here.
                        _a.sent();
                        return [2 /*return*/, plan];
                }
            });
        });
    };
    DexieUserWorkoutPlanRepository.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_database_1.db.userWorkoutPlans.delete(id)];
                    case 1:
                        _a.sent();
                        // Dexie delete returns void, so we assume success if no error thrown
                        return [2 /*return*/, true];
                }
            });
        });
    };
    DexieUserWorkoutPlanRepository.prototype.deactivateAllUserPlans = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var activePlans, updates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, app_database_1.db.userWorkoutPlans
                            .where('userId')
                            .equals(userId)
                            .filter(function (plan) { return plan.isActive; })
                            .toArray()];
                    case 1:
                        activePlans = _a.sent();
                        updates = activePlans.map(function (plan) {
                            return app_database_1.db.userWorkoutPlans.update(plan.id, { isActive: false });
                        });
                        return [4 /*yield*/, Promise.all(updates)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return DexieUserWorkoutPlanRepository;
}());
exports.DexieUserWorkoutPlanRepository = DexieUserWorkoutPlanRepository;
