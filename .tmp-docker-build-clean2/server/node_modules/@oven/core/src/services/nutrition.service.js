"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionService = void 0;
class NutritionService {
    constructor(nutritionRepository) {
        this.nutritionRepository = nutritionRepository;
    }
    async addFood(foodData) {
        return this.nutritionRepository.createFood(foodData);
    }
    async getFood(id) {
        return this.nutritionRepository.findFoodById(id);
    }
    async getAllFoods() {
        return this.nutritionRepository.findAllFoods();
    }
    async getFoodsByCategory(category) {
        return this.nutritionRepository.findFoodsByCategory(category);
    }
    async searchFoods(name) {
        return this.nutritionRepository.searchFoodsByName(name);
    }
    async updateFood(food) {
        return this.nutritionRepository.updateFood(food);
    }
    async deleteFood(id) {
        return this.nutritionRepository.deleteFood(id);
    }
    async addMeal(mealData) {
        return this.nutritionRepository.createMeal(mealData);
    }
    async getMeal(id) {
        return this.nutritionRepository.findMealById(id);
    }
    async getMealsByDate(userId, date) {
        return this.nutritionRepository.findMealsByUserIdAndDate(userId, date);
    }
    async getAllMealsByUserId(userId) {
        return this.nutritionRepository.findMealsByUserId(userId);
    }
    async updateMeal(meal) {
        return this.nutritionRepository.updateMeal(meal);
    }
    async deleteMeal(id) {
        return this.nutritionRepository.deleteMeal(id);
    }
    async getOrCreateNutritionLog(userId, date) {
        let log = await this.nutritionRepository.findNutritionLogByUserIdAndDate(userId, date);
        if (!log) {
            log = await this.nutritionRepository.createNutritionLog({
                userId,
                date,
                meals: [],
                totalCalories: 0,
                totalMacros: {
                    protein: 0,
                    carbs: 0,
                    fat: 0
                }
            });
        }
        return log;
    }
    async getNutritionLog(id) {
        return this.nutritionRepository.findNutritionLogById(id);
    }
    async getNutritionLogByDate(userId, date) {
        return this.nutritionRepository.findNutritionLogByUserIdAndDate(userId, date);
    }
    async getRecentNutritionLogs(userId, days = 7) {
        return this.nutritionRepository.findNutritionLogsByUserId(userId, days);
    }
    async updateNutritionLog(log) {
        return this.nutritionRepository.updateNutritionLog(log);
    }
    async deleteNutritionLog(id) {
        return this.nutritionRepository.deleteNutritionLog(id);
    }
    async setNutritionGoal(goalData) {
        if (goalData.isActive) {
            await this.nutritionRepository.deactivateAllNutritionGoalsByUserId(goalData.userId);
        }
        return this.nutritionRepository.createNutritionGoal(goalData);
    }
    async getActiveNutritionGoal(userId) {
        return this.nutritionRepository.findActiveNutritionGoalByUserId(userId);
    }
    async updateNutritionGoal(goal) {
        if (goal.isActive) {
            await this.nutritionRepository.deactivateAllNutritionGoalsByUserId(goal.userId);
        }
        return this.nutritionRepository.updateNutritionGoal(goal);
    }
    async deleteNutritionGoal(id) {
        return this.nutritionRepository.deleteNutritionGoal(id);
    }
    async calculateMealNutrition(meal) {
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        for (const foodPortion of meal.foods) {
            const food = await this.getFood(foodPortion.foodId);
            if (food) {
                let portionMultiplier = 1;
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
                    portionMultiplier = foodPortion.quantity;
                }
                totalCalories += food.calories * portionMultiplier;
                totalProtein += food.macros.protein * portionMultiplier;
                totalCarbs += food.macros.carbs * portionMultiplier;
                totalFat += food.macros.fat * portionMultiplier;
            }
        }
        return {
            calories: Math.round(totalCalories),
            macros: {
                protein: Math.round(totalProtein),
                carbs: Math.round(totalCarbs),
                fat: Math.round(totalFat)
            }
        };
    }
    async updateNutritionLogWithMeals(userId, date) {
        const meals = await this.getMealsByDate(userId, date);
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        for (const meal of meals) {
            const nutrition = await this.calculateMealNutrition(meal);
            totalCalories += nutrition.calories;
            totalProtein += nutrition.macros.protein;
            totalCarbs += nutrition.macros.carbs;
            totalFat += nutrition.macros.fat;
        }
        let log = await this.getNutritionLogByDate(userId, date);
        if (!log) {
            log = await this.getOrCreateNutritionLog(userId, date);
        }
        const updatedLog = await this.updateNutritionLog(Object.assign(Object.assign({}, log), { meals,
            totalCalories, totalMacros: {
                protein: totalProtein,
                carbs: totalCarbs,
                fat: totalFat
            } }));
        return updatedLog;
    }
    async calculateDailyNutritionProgress(userId, date) {
        const log = await this.getNutritionLogByDate(userId, date);
        if (!log) {
            return null;
        }
        const goal = await this.getActiveNutritionGoal(userId);
        if (!goal) {
            return null;
        }
        const caloriesPercentage = Math.min(Math.round((log.totalCalories / goal.dailyCalories) * 100), 100);
        const proteinPercentage = Math.min(Math.round((log.totalMacros.protein / goal.dailyMacros.protein) * 100), 100);
        const carbsPercentage = Math.min(Math.round((log.totalMacros.carbs / goal.dailyMacros.carbs) * 100), 100);
        const fatPercentage = Math.min(Math.round((log.totalMacros.fat / goal.dailyMacros.fat) * 100), 100);
        return {
            calories: log.totalCalories,
            macros: log.totalMacros,
            percentage: {
                calories: caloriesPercentage,
                protein: proteinPercentage,
                carbs: carbsPercentage,
                fat: fatPercentage
            }
        };
    }
}
exports.NutritionService = NutritionService;
//# sourceMappingURL=nutrition.service.js.map