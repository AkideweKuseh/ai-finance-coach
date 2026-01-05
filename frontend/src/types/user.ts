/**
 * User Type Definitions
 */

export interface User {
  _id: string;
  email: string;
  name: string;
  profile: UserProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  // Basic stats
  age: number;
  height: number; // in cm
  weight: number; // in kg

  // Goals
  goal: "lose" | "maintain" | "gain";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "athlete";

  // Dietary preferences
  dietaryPreferences: DietaryPreference[];

  // Calculated values
  dailyCalorieGoal: number;
  macroGoals: MacroGoals;

  // UI preferences
  unitPreference: "metric" | "imperial";
}

export interface MacroGoals {
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

export type DietaryPreference =
  | "vegan"
  | "vegetarian"
  | "paleo"
  | "keto"
  | "gluten-free"
  | "dairy-free"
  | "halal"
  | "kosher";

export interface UserRegistrationData {
  email: string;
  password: string;
  name: string;
  profile: Partial<UserProfile>;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserUpdateData {
  name?: string;
  profile?: Partial<UserProfile>;
}

export interface DailySummary {
  date: string; // ISO date string
  caloriesConsumed: number;
  macrosConsumed: MacroGoals;
  caloriesRemaining: number;
  macrosRemaining: MacroGoals;
  mealsLogged: number;
}
