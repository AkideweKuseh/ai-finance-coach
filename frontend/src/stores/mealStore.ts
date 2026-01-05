/**
 * Meal Store - Zustand
 *
 * Manages meals, meal logs, and suggestions
 */

import { create } from "zustand";
import { Meal, MealLog, MealSuggestion } from "../types/meal";

interface MealState {
  // State
  meals: Meal[];
  mealLogs: MealLog[];
  suggestions: MealSuggestion[];
  selectedMeal: Meal | null;
  isLoading: boolean;

  // Actions
  setMeals: (meals: Meal[]) => void;
  setMealLogs: (logs: MealLog[]) => void;
  addMealLog: (log: MealLog) => void;
  setSuggestions: (suggestions: MealSuggestion[]) => void;
  setSelectedMeal: (meal: Meal | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearMeals: () => void;
}

export const useMealStore = create<MealState>((set: any) => ({
  // Initial state
  meals: [],
  mealLogs: [],
  suggestions: [],
  selectedMeal: null,
  isLoading: false,

  /**
   * Set all available meals
   */
  setMeals: (meals: Meal[]) => {
    set({ meals, isLoading: false });
  },

  /**
   * Set user's meal logs
   */
  setMealLogs: (logs: MealLog[]) => {
    set({ mealLogs: logs });
  },

  /**
   * Add a new meal log
   */
  addMealLog: (log: MealLog) => {
    set((state: any) => ({
      mealLogs: [...state.mealLogs, log],
    }));
  },

  /**
   * Set AI meal suggestions
   */
  setSuggestions: (suggestions: MealSuggestion[]) => {
    set({ suggestions });
  },

  /**
   * Set selected meal for detail view
   */
  setSelectedMeal: (meal: Meal | null) => {
    set({ selectedMeal: meal });
  },

  /**
   * Set loading state
   */
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  /**
   * Clear meal data
   */
  clearMeals: () => {
    set({
      meals: [],
      mealLogs: [],
      suggestions: [],
      selectedMeal: null,
      isLoading: false,
    });
  },
}));

export default useMealStore;
