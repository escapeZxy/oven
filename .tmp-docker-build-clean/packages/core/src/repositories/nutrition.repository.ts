import { v4 as uuidv4 } from 'uuid';
import { Food, Meal, NutritionLog, NutritionGoal } from '../models';

export class NutritionRepository {
  private foods: Food[] = [];
  private meals: Meal[] = [];
  private nutritionLogs: NutritionLog[] = [];
  private nutritionGoals: NutritionGoal[] = [];

  // Food CRUD
  public async createFood(foodData: Omit<Food, 'id'>): Promise<Food> {
    const newFood: Food = {
      id: uuidv4(),
      ...foodData,
    };
    this.foods.push(newFood);
    return newFood;
  }

  public async findFoodById(id: string): Promise<Food | null> {
    return this.foods.find(food => food.id === id) || null;
  }

  public async findAllFoods(): Promise<Food[]> {
    return [...this.foods];
  }

  public async findFoodsByCategory(category: Food['category']): Promise<Food[]> {
    return this.foods.filter(food => food.category === category);
  }

  public async searchFoodsByName(name: string): Promise<Food[]> {
    const lowercaseName = name.toLowerCase();
    return this.foods.filter(food => food.name.toLowerCase().includes(lowercaseName));
  }

  public async updateFood(food: Food): Promise<Food | null> {
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

  public async deleteFood(id: string): Promise<boolean> {
    const initialLength = this.foods.length;
    this.foods = this.foods.filter(food => food.id !== id);
    return this.foods.length < initialLength;
  }

  // Meal CRUD
  public async createMeal(mealData: Omit<Meal, 'id'>): Promise<Meal> {
    const newMeal: Meal = {
      id: uuidv4(),
      ...mealData,
    };
    this.meals.push(newMeal);
    return newMeal;
  }

  public async findMealById(id: string): Promise<Meal | null> {
    return this.meals.find(meal => meal.id === id) || null;
  }

  public async findMealsByUserIdAndDate(userId: string, date: string): Promise<Meal[]> {
    return this.meals
      .filter(meal => meal.userId === userId && meal.date.startsWith(date))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  public async findMealsByUserId(userId: string): Promise<Meal[]> {
    return this.meals
      .filter(meal => meal.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public async updateMeal(meal: Meal): Promise<Meal | null> {
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

  public async deleteMeal(id: string): Promise<boolean> {
    const initialLength = this.meals.length;
    this.meals = this.meals.filter(meal => meal.id !== id);
    return this.meals.length < initialLength;
  }

  // Nutrition Log CRUD
  public async createNutritionLog(logData: Omit<NutritionLog, 'id'>): Promise<NutritionLog> {
    const newLog: NutritionLog = {
      id: uuidv4(),
      ...logData,
    };
    this.nutritionLogs.push(newLog);
    return newLog;
  }

  public async findNutritionLogById(id: string): Promise<NutritionLog | null> {
    return this.nutritionLogs.find(log => log.id === id) || null;
  }

  public async findNutritionLogByUserIdAndDate(userId: string, date: string): Promise<NutritionLog | null> {
    return this.nutritionLogs.find(log => log.userId === userId && log.date === date) || null;
  }

  public async findNutritionLogsByUserId(userId: string, limit?: number): Promise<NutritionLog[]> {
    const logs = this.nutritionLogs
      .filter(log => log.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return limit ? logs.slice(0, limit) : logs;
  }

  public async updateNutritionLog(log: NutritionLog): Promise<NutritionLog | null> {
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

  public async deleteNutritionLog(id: string): Promise<boolean> {
    const initialLength = this.nutritionLogs.length;
    this.nutritionLogs = this.nutritionLogs.filter(log => log.id !== id);
    return this.nutritionLogs.length < initialLength;
  }

  // Nutrition Goal CRUD
  public async createNutritionGoal(goalData: Omit<NutritionGoal, 'id'>): Promise<NutritionGoal> {
    const newGoal: NutritionGoal = {
      id: uuidv4(),
      ...goalData,
    };
    this.nutritionGoals.push(newGoal);
    return newGoal;
  }

  public async findNutritionGoalById(id: string): Promise<NutritionGoal | null> {
    return this.nutritionGoals.find(goal => goal.id === id) || null;
  }

  public async findActiveNutritionGoalByUserId(userId: string): Promise<NutritionGoal | null> {
    return this.nutritionGoals.find(goal => goal.userId === userId && goal.isActive) || null;
  }

  public async findNutritionGoalsByUserId(userId: string): Promise<NutritionGoal[]> {
    return this.nutritionGoals
      .filter(goal => goal.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async updateNutritionGoal(goal: NutritionGoal): Promise<NutritionGoal | null> {
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

  public async deactivateAllNutritionGoalsByUserId(userId: string): Promise<void> {
    this.nutritionGoals = this.nutritionGoals.map(goal =>
      goal.userId === userId ? { ...goal, isActive: false } : goal
    );
  }

  public async deleteNutritionGoal(id: string): Promise<boolean> {
    const initialLength = this.nutritionGoals.length;
    this.nutritionGoals = this.nutritionGoals.filter(goal => goal.id !== id);
    return this.nutritionGoals.length < initialLength;
  }
}