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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionRepository = void 0;
var uuid_1 = require("uuid");
var NutritionRepository = /** @class */ (function () {
    function NutritionRepository() {
        this.foods = [];
        this.meals = [];
        this.nutritionLogs = [];
        this.nutritionGoals = [];
    }
    // Food CRUD
    NutritionRepository.prototype.createFood = function (foodData) {
        return __awaiter(this, void 0, void 0, function () {
            var newFood;
            return __generator(this, function (_a) {
                newFood = __assign({ id: (0, uuid_1.v4)() }, foodData);
                this.foods.push(newFood);
                return [2 /*return*/, newFood];
            });
        });
    };
    NutritionRepository.prototype.findFoodById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.foods.find(function (food) { return food.id === id; }) || null];
            });
        });
    };
    NutritionRepository.prototype.findAllFoods = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, __spreadArray([], this.foods, true)];
            });
        });
    };
    NutritionRepository.prototype.findFoodsByCategory = function (category) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.foods.filter(function (food) { return food.category === category; })];
            });
        });
    };
    NutritionRepository.prototype.searchFoodsByName = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var lowercaseName;
            return __generator(this, function (_a) {
                lowercaseName = name.toLowerCase();
                return [2 /*return*/, this.foods.filter(function (food) { return food.name.toLowerCase().includes(lowercaseName); })];
            });
        });
    };
    NutritionRepository.prototype.updateFood = function (food) {
        return __awaiter(this, void 0, void 0, function () {
            var existingIndex;
            return __generator(this, function (_a) {
                existingIndex = this.foods.findIndex(function (f) { return f.id === food.id; });
                if (existingIndex === -1) {
                    return [2 /*return*/, null];
                }
                this.foods = __spreadArray(__spreadArray(__spreadArray([], this.foods.slice(0, existingIndex), true), [
                    food
                ], false), this.foods.slice(existingIndex + 1), true);
                return [2 /*return*/, food];
            });
        });
    };
    NutritionRepository.prototype.deleteFood = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var initialLength;
            return __generator(this, function (_a) {
                initialLength = this.foods.length;
                this.foods = this.foods.filter(function (food) { return food.id !== id; });
                return [2 /*return*/, this.foods.length < initialLength];
            });
        });
    };
    // Meal CRUD
    NutritionRepository.prototype.createMeal = function (mealData) {
        return __awaiter(this, void 0, void 0, function () {
            var newMeal;
            return __generator(this, function (_a) {
                newMeal = __assign({ id: (0, uuid_1.v4)() }, mealData);
                this.meals.push(newMeal);
                return [2 /*return*/, newMeal];
            });
        });
    };
    NutritionRepository.prototype.findMealById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.meals.find(function (meal) { return meal.id === id; }) || null];
            });
        });
    };
    NutritionRepository.prototype.findMealsByUserIdAndDate = function (userId, date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.meals
                        .filter(function (meal) { return meal.userId === userId && meal.date.startsWith(date); })
                        .sort(function (a, b) { return new Date(a.date).getTime() - new Date(b.date).getTime(); })];
            });
        });
    };
    NutritionRepository.prototype.findMealsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.meals
                        .filter(function (meal) { return meal.userId === userId; })
                        .sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); })];
            });
        });
    };
    NutritionRepository.prototype.updateMeal = function (meal) {
        return __awaiter(this, void 0, void 0, function () {
            var existingIndex;
            return __generator(this, function (_a) {
                existingIndex = this.meals.findIndex(function (m) { return m.id === meal.id; });
                if (existingIndex === -1) {
                    return [2 /*return*/, null];
                }
                this.meals = __spreadArray(__spreadArray(__spreadArray([], this.meals.slice(0, existingIndex), true), [
                    meal
                ], false), this.meals.slice(existingIndex + 1), true);
                return [2 /*return*/, meal];
            });
        });
    };
    NutritionRepository.prototype.deleteMeal = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var initialLength;
            return __generator(this, function (_a) {
                initialLength = this.meals.length;
                this.meals = this.meals.filter(function (meal) { return meal.id !== id; });
                return [2 /*return*/, this.meals.length < initialLength];
            });
        });
    };
    // Nutrition Log CRUD
    NutritionRepository.prototype.createNutritionLog = function (logData) {
        return __awaiter(this, void 0, void 0, function () {
            var newLog;
            return __generator(this, function (_a) {
                newLog = __assign({ id: (0, uuid_1.v4)() }, logData);
                this.nutritionLogs.push(newLog);
                return [2 /*return*/, newLog];
            });
        });
    };
    NutritionRepository.prototype.findNutritionLogById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionLogs.find(function (log) { return log.id === id; }) || null];
            });
        });
    };
    NutritionRepository.prototype.findNutritionLogByUserIdAndDate = function (userId, date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionLogs.find(function (log) { return log.userId === userId && log.date === date; }) || null];
            });
        });
    };
    NutritionRepository.prototype.findNutritionLogsByUserId = function (userId, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var logs;
            return __generator(this, function (_a) {
                logs = this.nutritionLogs
                    .filter(function (log) { return log.userId === userId; })
                    .sort(function (a, b) { return new Date(b.date).getTime() - new Date(a.date).getTime(); });
                return [2 /*return*/, limit ? logs.slice(0, limit) : logs];
            });
        });
    };
    NutritionRepository.prototype.updateNutritionLog = function (log) {
        return __awaiter(this, void 0, void 0, function () {
            var existingIndex;
            return __generator(this, function (_a) {
                existingIndex = this.nutritionLogs.findIndex(function (l) { return l.id === log.id; });
                if (existingIndex === -1) {
                    return [2 /*return*/, null];
                }
                this.nutritionLogs = __spreadArray(__spreadArray(__spreadArray([], this.nutritionLogs.slice(0, existingIndex), true), [
                    log
                ], false), this.nutritionLogs.slice(existingIndex + 1), true);
                return [2 /*return*/, log];
            });
        });
    };
    NutritionRepository.prototype.deleteNutritionLog = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var initialLength;
            return __generator(this, function (_a) {
                initialLength = this.nutritionLogs.length;
                this.nutritionLogs = this.nutritionLogs.filter(function (log) { return log.id !== id; });
                return [2 /*return*/, this.nutritionLogs.length < initialLength];
            });
        });
    };
    // Nutrition Goal CRUD
    NutritionRepository.prototype.createNutritionGoal = function (goalData) {
        return __awaiter(this, void 0, void 0, function () {
            var newGoal;
            return __generator(this, function (_a) {
                newGoal = __assign({ id: (0, uuid_1.v4)() }, goalData);
                this.nutritionGoals.push(newGoal);
                return [2 /*return*/, newGoal];
            });
        });
    };
    NutritionRepository.prototype.findNutritionGoalById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionGoals.find(function (goal) { return goal.id === id; }) || null];
            });
        });
    };
    NutritionRepository.prototype.findActiveNutritionGoalByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionGoals.find(function (goal) { return goal.userId === userId && goal.isActive; }) || null];
            });
        });
    };
    NutritionRepository.prototype.findNutritionGoalsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionGoals
                        .filter(function (goal) { return goal.userId === userId; })
                        .sort(function (a, b) { return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); })];
            });
        });
    };
    NutritionRepository.prototype.updateNutritionGoal = function (goal) {
        return __awaiter(this, void 0, void 0, function () {
            var existingIndex;
            return __generator(this, function (_a) {
                existingIndex = this.nutritionGoals.findIndex(function (g) { return g.id === goal.id; });
                if (existingIndex === -1) {
                    return [2 /*return*/, null];
                }
                this.nutritionGoals = __spreadArray(__spreadArray(__spreadArray([], this.nutritionGoals.slice(0, existingIndex), true), [
                    goal
                ], false), this.nutritionGoals.slice(existingIndex + 1), true);
                return [2 /*return*/, goal];
            });
        });
    };
    NutritionRepository.prototype.deactivateAllNutritionGoalsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.nutritionGoals = this.nutritionGoals.map(function (goal) {
                    return goal.userId === userId ? __assign(__assign({}, goal), { isActive: false }) : goal;
                });
                return [2 /*return*/];
            });
        });
    };
    NutritionRepository.prototype.deleteNutritionGoal = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var initialLength;
            return __generator(this, function (_a) {
                initialLength = this.nutritionGoals.length;
                this.nutritionGoals = this.nutritionGoals.filter(function (goal) { return goal.id !== id; });
                return [2 /*return*/, this.nutritionGoals.length < initialLength];
            });
        });
    };
    return NutritionRepository;
}());
exports.NutritionRepository = NutritionRepository;
