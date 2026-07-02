import { Food, Meal, NutritionLog, NutritionGoal } from '../models';
export declare class NutritionRepository {
    private foods;
    private meals;
    private nutritionLogs;
    private nutritionGoals;
    createFood(foodData: Omit<Food, 'id'>): Promise<Food>;
    findFoodById(id: string): Promise<Food | null>;
    findAllFoods(): Promise<Food[]>;
    findFoodsByCategory(category: Food['category']): Promise<Food[]>;
    searchFoodsByName(name: string): Promise<Food[]>;
    updateFood(food: Food): Promise<Food | null>;
    deleteFood(id: string): Promise<boolean>;
    createMeal(mealData: Omit<Meal, 'id'>): Promise<Meal>;
    findMealById(id: string): Promise<Meal | null>;
    findMealsByUserIdAndDate(userId: string, date: string): Promise<Meal[]>;
    findMealsByUserId(userId: string): Promise<Meal[]>;
    updateMeal(meal: Meal): Promise<Meal | null>;
    deleteMeal(id: string): Promise<boolean>;
    createNutritionLog(logData: Omit<NutritionLog, 'id'>): Promise<NutritionLog>;
    findNutritionLogById(id: string): Promise<NutritionLog | null>;
    findNutritionLogByUserIdAndDate(userId: string, date: string): Promise<NutritionLog | null>;
    findNutritionLogsByUserId(userId: string, limit?: number): Promise<NutritionLog[]>;
    updateNutritionLog(log: NutritionLog): Promise<NutritionLog | null>;
    deleteNutritionLog(id: string): Promise<boolean>;
    createNutritionGoal(goalData: Omit<NutritionGoal, 'id'>): Promise<NutritionGoal>;
    findNutritionGoalById(id: string): Promise<NutritionGoal | null>;
    findActiveNutritionGoalByUserId(userId: string): Promise<NutritionGoal | null>;
    findNutritionGoalsByUserId(userId: string): Promise<NutritionGoal[]>;
    updateNutritionGoal(goal: NutritionGoal): Promise<NutritionGoal | null>;
    deactivateAllNutritionGoalsByUserId(userId: string): Promise<void>;
    deleteNutritionGoal(id: string): Promise<boolean>;
}
//# sourceMappingURL=nutrition.repository.d.ts.map