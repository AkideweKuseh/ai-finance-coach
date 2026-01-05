/**
 * Meals API - Meal management endpoints
 */

import apiClient, { handleApiError } from "./client";
import {
  Meal,
  MealLog,
  CreateMealLogData,
  MealSuggestion,
} from "../types/meal";

/**
 * Get all available meals
 */
export const getMeals = async (): Promise<Meal[]> => {
  try {
    const response = await apiClient.get<Meal[]>("/meals");
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get meal by ID
 */
export const getMealById = async (id: string): Promise<Meal> => {
  try {
    const response = await apiClient.get<Meal>(`/meals/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get user's meal logs
 */
export const getMealLogs = async (date?: string): Promise<MealLog[]> => {
  try {
    const params = date ? { date } : {};
    const response = await apiClient.get<MealLog[]>("/meals/logs", { params });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Log a meal
 */
export const logMeal = async (data: CreateMealLogData): Promise<MealLog> => {
  try {
    const response = await apiClient.post<MealLog>("/meals/logs", data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Delete meal log
 */
export const deleteMealLog = async (logId: string): Promise<void> => {
  try {
    await apiClient.delete(`/meals/logs/${logId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get AI meal suggestions based on user profile
 */
export const getMealSuggestions = async (): Promise<MealSuggestion[]> => {
  try {
    const response = await apiClient.get<MealSuggestion[]>(
      "/meals/suggestions"
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default {
  getMeals,
  getMealById,
  getMealLogs,
  logMeal,
  deleteMealLog,
  getMealSuggestions,
};
