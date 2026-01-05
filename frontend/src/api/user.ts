/**
 * User API - User profile and settings endpoints
 */

import apiClient, { handleApiError } from "./client";
import { User, UserUpdateData, DailySummary } from "../types/user";

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<User> => {
  try {
    const response = await apiClient.get<User>("/user/profile");
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (data: UserUpdateData): Promise<User> => {
  try {
    const response = await apiClient.put<User>("/user/profile", data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get daily calorie and macro summary
 */
export const getDailySummary = async (date?: string): Promise<DailySummary> => {
  try {
    const params = date ? { date } : {};
    const response = await apiClient.get<DailySummary>("/user/daily-summary", {
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Delete user account
 */
export const deleteAccount = async (): Promise<void> => {
  try {
    await apiClient.delete("/user/account");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default {
  getProfile,
  updateProfile,
  getDailySummary,
  deleteAccount,
};
