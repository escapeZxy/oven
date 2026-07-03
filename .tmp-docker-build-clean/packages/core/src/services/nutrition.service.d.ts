import { Food, Meal, NutritionLog, NutritionGoal } from '../models';
import { NutritionRepository } from '../repositories/nutrition.repository';
export declare class NutritionService {
    private nutritionRepository;
    constructor(nutritionRepository: NutritionRepository);
    addFood(foodData: Omit<Food, 'id'>): Promise<Food>;
    getFood(id: string): Promise<Food | null>;
    getAllFoods(): Promise<Food[]>;
    getFoodsByCategory(category: Food['category']): Promise<Food[]>;
    searchFoods(name: string): Promise<Food[]>;
    updateFood(food: Food): Promise<Food | null>;
    deleteFood(id: string): Promise<boolean>;
    addMeal(mealData: Omit<Meal, 'id'>): Promise<Meal>;
    getMeal(id: string): Promise<Meal | null>;
    getMealsByDate(userId: string, date: string): Promise<Meal[]>;
    getAllMealsByUserId(userId: string): Promise<Meal[]>;
    updateMeal(meal: Meal): Promise<Meal | null>;
    deleteMeal(id: string): Promise<boolean>;
    getOrCreateNutritionLog(userId: string, date: string): Promise<NutritionLog>;
    getNutritionLog(id: string): Promise<NutritionLog | null>;
    getNutritionLogByDate(userId: string, date: string): Promise<NutritionLog | null>;
    getRecentNutritionLogs(userId: string, days?: number): Promise<NutritionLog[]>;
    updateNutritionLog(log: NutritionLog): Promise<NutritionLog | null>;
    deleteNutritionLog(id: string): Promise<boolean>;
    setNutritionGoal(goalData: Omit<NutritionGoal, 'id'>): Promise<NutritionGoal>;
    getActiveNutritionGoal(userId: string): Promise<NutritionGoal | null>;
    updateNutritionGoal(goal: NutritionGoal): Promise<NutritionGoal | null>;
    deleteNutritionGoal(id: string): Promise<boolean>;
    calculateMealNutrition(meal: Meal): Promise<{
        calories: number;
        macros: {
            protein: number;
            carbs: number;
            fat: number;
        };
    }>;
    updateNutritionLogWithMeals(userId: string, date: string): Promise<NutritionLog>;
    calculateDailyNutritionProgress(userId: string, date: string): Promise<{
        calories: number;
        macros: {
            protein: number;
            carbs: number;
            fat: number;
        };
        percentage: {
            calories: number;
            protein: number;
            carbs: number;
            fat: number;
        };
    } | null>;
}
