import { Food, Meal, NutritionLog, NutritionGoal } from '../models';
import { NutritionRepository } from '../repositories/nutrition.repository';

export class NutritionService {
  constructor(private nutritionRepository: NutritionRepository) {}

  // Food Methods
  public async addFood(foodData: Omit<Food, 'id'>): Promise<Food> {
    return this.nutritionRepository.createFood(foodData);
  }

  public async getFood(id: string): Promise<Food | null> {
    return this.nutritionRepository.findFoodById(id);
  }

  public async getAllFoods(): Promise<Food[]> {
    return this.nutritionRepository.findAllFoods();
  }

  public async getFoodsByCategory(category: Food['category']): Promise<Food[]> {
    return this.nutritionRepository.findFoodsByCategory(category);
  }

  public async searchFoods(name: string): Promise<Food[]> {
    return this.nutritionRepository.searchFoodsByName(name);
  }

  public async updateFood(food: Food): Promise<Food | null> {
    return this.nutritionRepository.updateFood(food);
  }

  public async deleteFood(id: string): Promise<boolean> {
    return this.nutritionRepository.deleteFood(id);
  }

  // Meal Methods
  public async addMeal(mealData: Omit<Meal, 'id'>): Promise<Meal> {
    return this.nutritionRepository.createMeal(mealData);
  }

  public async getMeal(id: string): Promise<Meal | null> {
    return this.nutritionRepository.findMealById(id);
  }

  public async getMealsByDate(userId: string, date: string): Promise<Meal[]> {
    return this.nutritionRepository.findMealsByUserIdAndDate(userId, date);
  }

  public async getAllMealsByUserId(userId: string): Promise<Meal[]> {
    return this.nutritionRepository.findMealsByUserId(userId);
  }

  public async updateMeal(meal: Meal): Promise<Meal | null> {
    return this.nutritionRepository.updateMeal(meal);
  }

  public async deleteMeal(id: string): Promise<boolean> {
    return this.nutritionRepository.deleteMeal(id);
  }

  // Nutrition Log Methods
  public async getOrCreateNutritionLog(userId: string, date: string): Promise<NutritionLog> {
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

  public async getNutritionLog(id: string): Promise<NutritionLog | null> {
    return this.nutritionRepository.findNutritionLogById(id);
  }

  public async getNutritionLogByDate(userId: string, date: string): Promise<NutritionLog | null> {
    return this.nutritionRepository.findNutritionLogByUserIdAndDate(userId, date);
  }

  public async getRecentNutritionLogs(userId: string, days: number = 7): Promise<NutritionLog[]> {
    return this.nutritionRepository.findNutritionLogsByUserId(userId, days);
  }

  public async updateNutritionLog(log: NutritionLog): Promise<NutritionLog | null> {
    return this.nutritionRepository.updateNutritionLog(log);
  }

  public async deleteNutritionLog(id: string): Promise<boolean> {
    return this.nutritionRepository.deleteNutritionLog(id);
  }

  // Nutrition Goal Methods
  public async setNutritionGoal(goalData: Omit<NutritionGoal, 'id'>): Promise<NutritionGoal> {
    // Deactivate any existing active goals
    if (goalData.isActive) {
      await this.nutritionRepository.deactivateAllNutritionGoalsByUserId(goalData.userId);
    }
    
    return this.nutritionRepository.createNutritionGoal(goalData);
  }

  public async getActiveNutritionGoal(userId: string): Promise<NutritionGoal | null> {
    return this.nutritionRepository.findActiveNutritionGoalByUserId(userId);
  }

  public async updateNutritionGoal(goal: NutritionGoal): Promise<NutritionGoal | null> {
    // If updating to active, deactivate others
    if (goal.isActive) {
      await this.nutritionRepository.deactivateAllNutritionGoalsByUserId(goal.userId);
    }
    
    return this.nutritionRepository.updateNutritionGoal(goal);
  }

  public async deleteNutritionGoal(id: string): Promise<boolean> {
    return this.nutritionRepository.deleteNutritionGoal(id);
  }

  // Calculate nutrition for a meal
  public async calculateMealNutrition(meal: Meal): Promise<{ calories: number; macros: { protein: number; carbs: number; fat: number } }> {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    for (const foodPortion of meal.foods) {
      const food = await this.getFood(foodPortion.foodId);
      if (food) {
        // Calculate the portion size relative to the food's serving size
        let portionMultiplier = 1;
        
        if (foodPortion.unit === 'serving') {
          portionMultiplier = foodPortion.quantity;
        } else if (foodPortion.unit === 'g' && food.servingUnit === 'g') {
          portionMultiplier = foodPortion.quantity / food.servingSize;
        } else if (foodPortion.unit === 'ml' && food.servingUnit === 'ml') {
          portionMultiplier = foodPortion.quantity / food.servingSize;
        } else if (foodPortion.unit === 'piece') {
          // Assume each piece is 1 serving
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

  // Update nutrition log with latest meal data
  public async updateNutritionLogWithMeals(userId: string, date: string): Promise<NutritionLog> {
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

    const updatedLog = await this.updateNutritionLog({
      ...log,
      meals,
      totalCalories,
      totalMacros: {
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat
      }
    });
    return updatedLog as NutritionLog;
  }

  // Calculate daily nutrition progress
  public async calculateDailyNutritionProgress(userId: string, date: string): Promise<{ calories: number; macros: { protein: number; carbs: number; fat: number }; percentage: { calories: number; protein: number; carbs: number; fat: number } } | null> {
    const log = await this.getNutritionLogByDate(userId, date);
    if (!log) {
      return null;
    }

    const goal = await this.getActiveNutritionGoal(userId);
    if (!goal) {
      return null;
    }

    // Calculate percentage progress
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