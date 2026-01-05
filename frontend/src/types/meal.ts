/**
 * Meal Type Definitions
 */

export interface Meal {
  _id: string;
  name: string;
  description: string;
  imageUrl?: string;

  // Nutrition info
  calories: number;
  macros: MacroNutrients;

  // Recipe details
  ingredients: Ingredient[];
  instructions: PreparationStep[];

  // Metadata
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: "easy" | "medium" | "hard";

  // Tags
  tags: MealTag[];
  mealType: MealType[];

  // Rating
  rating?: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface MacroNutrients {
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

export interface Ingredient {
  name: string;
  amount: string; // e.g., "2 cups", "400g"
  unit?: string;
  grams?: number;
}

export interface PreparationStep {
  stepNumber: number;
  instruction: string;
  duration?: number; // minutes
}

export type MealTag =
  | "high-protein"
  | "low-carb"
  | "low-fat"
  | "quick"
  | "easy"
  | "vegetarian"
  | "vegan"
  | "gluten-free"
  | "dairy-free";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealLog {
  _id: string;
  userId: string;
  mealId: string;
  meal: Meal;
  date: Date;
  mealType: MealType;
  servings: number;
  createdAt: Date;
}

export interface CreateMealLogData {
  mealId: string;
  date: string; // ISO date string
  mealType: MealType;
  servings: number;
}

export interface MealSuggestion {
  meal: Meal;
  reason: string;
  matchScore: number; // 0-100
  aiPick: boolean;
}
