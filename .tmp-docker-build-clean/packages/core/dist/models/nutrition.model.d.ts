/**
 * Represents a single food item with its nutritional information.
 */
export interface Food {
    id: string;
    name: string;
    description?: string;
    servingSize: number;
    servingUnit: 'g' | 'ml' | 'piece';
    calories: number;
    macros: {
        protein: number;
        carbs: number;
        fat: number;
    };
    micros?: {
        fiber?: number;
        sugar?: number;
        sodium?: number;
        cholesterol?: number;
        calcium?: number;
        iron?: number;
        potassium?: number;
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
    date: string;
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
    date: string;
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
//# sourceMappingURL=nutrition.model.d.ts.map