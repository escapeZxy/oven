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
export interface FoodPortion {
    foodId: string;
    quantity: number;
    unit: 'g' | 'ml' | 'piece' | 'serving';
}
export interface Meal {
    id: string;
    userId: string;
    date: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    foods: FoodPortion[];
    notes?: string;
}
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
