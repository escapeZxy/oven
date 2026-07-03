/**
 * Represents a single food item with its nutritional information.
 */
export interface Food {
  id: string;
  name: string;
  description?: string;
  servingSize: number; // in grams or ml
  servingUnit: 'g' | 'ml' | 'piece';
  calories: number; // per serving
  macros: {
    protein: number; // in grams
    carbs: number; // in grams
    fat: number; // in grams
  };
  micros?: {
    fiber?: number; // in grams
    sugar?: number; // in grams
    sodium?: number; // in milligrams
    cholesterol?: number; // in milligrams
    calcium?: number; // in milligrams
    iron?: number; // in milligrams
    potassium?: number; // in milligrams
  };
  category: 'protein' | 'carb' | 'fat' | 'vegetable' | 'fruit' | 'dairy' | 'other';
}

/**
 * Represents a specific portion of a food item consumed by a user.
 */
export interface FoodPortion {
  foodId: string;
  quantity: number;
  unit: 'g' | 'ml' | 'piece' | 'serving';
}

/**
 * Represents a single meal consumed by a user.
 */
export interface Meal {
  id: string;
  userId: string;
  date: string; // ISO 8601 format with time
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: FoodPortion[];
  notes?: string;
}

/**
 * Represents a daily nutrition log for a user.
 */
export interface NutritionLog {
  id: string;
  userId: string;
  date: string; // ISO 8601 format (date only)
  meals: Meal[];
  totalCalories: number;
  totalMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  notes?: string;
}

/**
 * Represents a user's nutrition goals.
 */
export interface NutritionGoal {
  id: string;
  userId: string;
  dailyCalories: number;
  dailyMacros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
