"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionRepository = void 0;
const uuid_1 = require("uuid");
class NutritionRepository {
    constructor() {
        this.foods = [];
        this.meals = [];
        this.nutritionLogs = [];
        this.nutritionGoals = [];
    }
    async createFood(foodData) {
        const newFood = Object.assign({ id: (0, uuid_1.v4)() }, foodData);
        this.foods.push(newFood);
        return newFood;
    }
    async findFoodById(id) {
        return this.foods.find(food => food.id === id) || null;
    }
    async findAllFoods() {
        return [...this.foods];
    }
    async findFoodsByCategory(category) {
        return this.foods.filter(food => food.category === category);
    }
    async searchFoodsByName(name) {
        const lowercaseName = name.toLowerCase();
        return this.foods.filter(food => food.name.toLowerCase().includes(lowercaseName));
    }
    async updateFood(food) {
        const existingIndex = this.foods.findIndex(f => f.id === food.id);
        if (existingIndex === -1) {
            return null;
        }
        this.foods = [
            ...this.foods.slice(0, existingIndex),
            food,
            ...this.foods.slice(existingIndex + 1)
        ];
        return food;
    }
    async deleteFood(id) {
        const initialLength = this.foods.length;
        this.foods = this.foods.filter(food => food.id !== id);
        return this.foods.length < initialLength;
    }
    async createMeal(mealData) {
        const newMeal = Object.assign({ id: (0, uuid_1.v4)() }, mealData);
        this.meals.push(newMeal);
        return newMeal;
    }
    async findMealById(id) {
        return this.meals.find(meal => meal.id === id) || null;
    }
    async findMealsByUserIdAndDate(userId, date) {
        return this.meals
            .filter(meal => meal.userId === userId && meal.date.startsWith(date))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    async findMealsByUserId(userId) {
        return this.meals
            .filter(meal => meal.userId === userId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    async updateMeal(meal) {
        const existingIndex = this.meals.findIndex(m => m.id === meal.id);
        if (existingIndex === -1) {
            return null;
        }
        this.meals = [
            ...this.meals.slice(0, existingIndex),
            meal,
            ...this.meals.slice(existingIndex + 1)
        ];
        return meal;
    }
    async deleteMeal(id) {
        const initialLength = this.meals.length;
        this.meals = this.meals.filter(meal => meal.id !== id);
        return this.meals.length < initialLength;
    }
    async createNutritionLog(logData) {
        const newLog = Object.assign({ id: (0, uuid_1.v4)() }, logData);
        this.nutritionLogs.push(newLog);
        return newLog;
    }
    async findNutritionLogById(id) {
        return this.nutritionLogs.find(log => log.id === id) || null;
    }
    async findNutritionLogByUserIdAndDate(userId, date) {
        return this.nutritionLogs.find(log => log.userId === userId && log.date === date) || null;
    }
    async findNutritionLogsByUserId(userId, limit) {
        const logs = this.nutritionLogs
            .filter(log => log.userId === userId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return limit ? logs.slice(0, limit) : logs;
    }
    async updateNutritionLog(log) {
        const existingIndex = this.nutritionLogs.findIndex(l => l.id === log.id);
        if (existingIndex === -1) {
            return null;
        }
        this.nutritionLogs = [
            ...this.nutritionLogs.slice(0, existingIndex),
            log,
            ...this.nutritionLogs.slice(existingIndex + 1)
        ];
        return log;
    }
    async deleteNutritionLog(id) {
        const initialLength = this.nutritionLogs.length;
        this.nutritionLogs = this.nutritionLogs.filter(log => log.id !== id);
        return this.nutritionLogs.length < initialLength;
    }
    async createNutritionGoal(goalData) {
        const newGoal = Object.assign({ id: (0, uuid_1.v4)() }, goalData);
        this.nutritionGoals.push(newGoal);
        return newGoal;
    }
    async findNutritionGoalById(id) {
        return this.nutritionGoals.find(goal => goal.id === id) || null;
    }
    async findActiveNutritionGoalByUserId(userId) {
        return this.nutritionGoals.find(goal => goal.userId === userId && goal.isActive) || null;
    }
    async findNutritionGoalsByUserId(userId) {
        return this.nutritionGoals
            .filter(goal => goal.userId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    async updateNutritionGoal(goal) {
        const existingIndex = this.nutritionGoals.findIndex(g => g.id === goal.id);
        if (existingIndex === -1) {
            return null;
        }
        this.nutritionGoals = [
            ...this.nutritionGoals.slice(0, existingIndex),
            goal,
            ...this.nutritionGoals.slice(existingIndex + 1)
        ];
        return goal;
    }
    async deactivateAllNutritionGoalsByUserId(userId) {
        this.nutritionGoals = this.nutritionGoals.map(goal => goal.userId === userId ? Object.assign(Object.assign({}, goal), { isActive: false }) : goal);
    }
    async deleteNutritionGoal(id) {
        const initialLength = this.nutritionGoals.length;
        this.nutritionGoals = this.nutritionGoals.filter(goal => goal.id !== id);
        return this.nutritionGoals.length < initialLength;
    }
}
exports.NutritionRepository = NutritionRepository;
//# sourceMappingURL=nutrition.repository.js.map