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
exports.NutritionService = void 0;
var NutritionService = /** @class */ (function () {
    function NutritionService(nutritionRepository) {
        this.nutritionRepository = nutritionRepository;
    }
    // Food Methods
    NutritionService.prototype.addFood = function (foodData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.createFood(foodData)];
            });
        });
    };
    NutritionService.prototype.getFood = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.findFoodById(id)];
            });
        });
    };
    NutritionService.prototype.getAllFoods = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.findAllFoods()];
            });
        });
    };
    NutritionService.prototype.getFoodsByCategory = function (category) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.findFoodsByCategory(category)];
            });
        });
    };
    NutritionService.prototype.searchFoods = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.searchFoodsByName(name)];
            });
        });
    };
    NutritionService.prototype.updateFood = function (food) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.updateFood(food)];
            });
        });
    };
    NutritionService.prototype.deleteFood = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.deleteFood(id)];
            });
        });
    };
    // Meal Methods
    NutritionService.prototype.addMeal = function (mealData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.createMeal(mealData)];
            });
        });
    };
    NutritionService.prototype.getMeal = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.findMealById(id)];
            });
        });
    };
    NutritionService.prototype.getMealsByDate = function (userId, date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.findMealsByUserIdAndDate(userId, date)];
            });
        });
    };
    NutritionService.prototype.getAllMealsByUserId = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.findMealsByUserId(userId)];
            });
        });
    };
    NutritionService.prototype.updateMeal = function (meal) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.updateMeal(meal)];
            });
        });
    };
    NutritionService.prototype.deleteMeal = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.deleteMeal(id)];
            });
        });
    };
    // Nutrition Log Methods
    NutritionService.prototype.getOrCreateNutritionLog = function (userId, date) {
        return __awaiter(this, void 0, void 0, function () {
            var log;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nutritionRepository.findNutritionLogByUserIdAndDate(userId, date)];
                    case 1:
                        log = _a.sent();
                        if (!!log) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.nutritionRepository.createNutritionLog({
                                userId: userId,
                                date: date,
                                meals: [],
                                totalCalories: 0,
                                totalMacros: {
                                    protein: 0,
                                    carbs: 0,
                                    fat: 0
                                }
                            })];
                    case 2:
                        log = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, log];
                }
            });
        });
    };
    NutritionService.prototype.getNutritionLog = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.findNutritionLogById(id)];
            });
        });
    };
    NutritionService.prototype.getNutritionLogByDate = function (userId, date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.findNutritionLogByUserIdAndDate(userId, date)];
            });
        });
    };
    NutritionService.prototype.getRecentNutritionLogs = function (userId_1) {
        return __awaiter(this, arguments, void 0, function (userId, days) {
            if (days === void 0) { days = 7; }
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.findNutritionLogsByUserId(userId, days)];
            });
        });
    };
    NutritionService.prototype.updateNutritionLog = function (log) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.updateNutritionLog(log)];
            });
        });
    };
    NutritionService.prototype.deleteNutritionLog = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.deleteNutritionLog(id)];
            });
        });
    };
    // Nutrition Goal Methods
    NutritionService.prototype.setNutritionGoal = function (goalData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!goalData.isActive) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.nutritionRepository.deactivateAllNutritionGoalsByUserId(goalData.userId)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.nutritionRepository.createNutritionGoal(goalData)];
                }
            });
        });
    };
    NutritionService.prototype.getActiveNutritionGoal = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.findActiveNutritionGoalByUserId(userId)];
            });
        });
    };
    NutritionService.prototype.updateNutritionGoal = function (goal) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!goal.isActive) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.nutritionRepository.deactivateAllNutritionGoalsByUserId(goal.userId)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, this.nutritionRepository.updateNutritionGoal(goal)];
                }
            });
        });
    };
    NutritionService.prototype.deleteNutritionGoal = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.nutritionRepository.deleteNutritionGoal(id)];
            });
        });
    };
    // Calculate nutrition for a meal
    NutritionService.prototype.calculateMealNutrition = function (meal) {
        return __awaiter(this, void 0, void 0, function () {
            var totalCalories, totalProtein, totalCarbs, totalFat, _i, _a, foodPortion, food, portionMultiplier;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        totalCalories = 0;
                        totalProtein = 0;
                        totalCarbs = 0;
                        totalFat = 0;
                        _i = 0, _a = meal.foods;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        foodPortion = _a[_i];
                        return [4 /*yield*/, this.getFood(foodPortion.foodId)];
                    case 2:
                        food = _b.sent();
                        if (food) {
                            portionMultiplier = 1;
                            if (foodPortion.unit === 'serving') {
                                portionMultiplier = foodPortion.quantity;
                            }
                            else if (foodPortion.unit === 'g' && food.servingUnit === 'g') {
                                portionMultiplier = foodPortion.quantity / food.servingSize;
                            }
                            else if (foodPortion.unit === 'ml' && food.servingUnit === 'ml') {
                                portionMultiplier = foodPortion.quantity / food.servingSize;
                            }
                            else if (foodPortion.unit === 'piece') {
                                // Assume each piece is 1 serving
                                portionMultiplier = foodPortion.quantity;
                            }
                            totalCalories += food.calories * portionMultiplier;
                            totalProtein += food.macros.protein * portionMultiplier;
                            totalCarbs += food.macros.carbs * portionMultiplier;
                            totalFat += food.macros.fat * portionMultiplier;
                        }
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, {
                            calories: Math.round(totalCalories),
                            macros: {
                                protein: Math.round(totalProtein),
                                carbs: Math.round(totalCarbs),
                                fat: Math.round(totalFat)
                            }
                        }];
                }
            });
        });
    };
    // Update nutrition log with latest meal data
    NutritionService.prototype.updateNutritionLogWithMeals = function (userId, date) {
        return __awaiter(this, void 0, void 0, function () {
            var meals, totalCalories, totalProtein, totalCarbs, totalFat, _i, meals_1, meal, nutrition, log, updatedLog;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getMealsByDate(userId, date)];
                    case 1:
                        meals = _a.sent();
                        totalCalories = 0;
                        totalProtein = 0;
                        totalCarbs = 0;
                        totalFat = 0;
                        _i = 0, meals_1 = meals;
                        _a.label = 2;
                    case 2:
                        if (!(_i < meals_1.length)) return [3 /*break*/, 5];
                        meal = meals_1[_i];
                        return [4 /*yield*/, this.calculateMealNutrition(meal)];
                    case 3:
                        nutrition = _a.sent();
                        totalCalories += nutrition.calories;
                        totalProtein += nutrition.macros.protein;
                        totalCarbs += nutrition.macros.carbs;
                        totalFat += nutrition.macros.fat;
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [4 /*yield*/, this.getNutritionLogByDate(userId, date)];
                    case 6:
                        log = _a.sent();
                        if (!!log) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.getOrCreateNutritionLog(userId, date)];
                    case 7:
                        log = _a.sent();
                        _a.label = 8;
                    case 8: return [4 /*yield*/, this.updateNutritionLog(__assign(__assign({}, log), { meals: meals, totalCalories: totalCalories, totalMacros: {
                                protein: totalProtein,
                                carbs: totalCarbs,
                                fat: totalFat
                            } }))];
                    case 9:
                        updatedLog = _a.sent();
                        return [2 /*return*/, updatedLog];
                }
            });
        });
    };
    // Calculate daily nutrition progress
    NutritionService.prototype.calculateDailyNutritionProgress = function (userId, date) {
        return __awaiter(this, void 0, void 0, function () {
            var log, goal, caloriesPercentage, proteinPercentage, carbsPercentage, fatPercentage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNutritionLogByDate(userId, date)];
                    case 1:
                        log = _a.sent();
                        if (!log) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, this.getActiveNutritionGoal(userId)];
                    case 2:
                        goal = _a.sent();
                        if (!goal) {
                            return [2 /*return*/, null];
                        }
                        caloriesPercentage = Math.min(Math.round((log.totalCalories / goal.dailyCalories) * 100), 100);
                        proteinPercentage = Math.min(Math.round((log.totalMacros.protein / goal.dailyMacros.protein) * 100), 100);
                        carbsPercentage = Math.min(Math.round((log.totalMacros.carbs / goal.dailyMacros.carbs) * 100), 100);
                        fatPercentage = Math.min(Math.round((log.totalMacros.fat / goal.dailyMacros.fat) * 100), 100);
                        return [2 /*return*/, {
                                calories: log.totalCalories,
                                macros: log.totalMacros,
                                percentage: {
                                    calories: caloriesPercentage,
                                    protein: proteinPercentage,
                                    carbs: carbsPercentage,
                                    fat: fatPercentage
                                }
                            }];
                }
            });
        });
    };
    return NutritionService;
}());
exports.NutritionService = NutritionService;
