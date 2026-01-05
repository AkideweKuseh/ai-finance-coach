/**
 * Auth API - Authentication endpoints
 */

import apiClient, { handleApiError } from "./client";
import { UserLoginData, UserRegistrationData, User } from "../types/user";

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Register new user
 */
export const register = async (
  data: UserRegistrationData
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Login user
 */
export const login = async (data: UserLoginData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (
  refreshToken: string
): Promise<RefreshTokenResponse> => {
  try {
    const response = await apiClient.post<RefreshTokenResponse>(
      "/auth/refresh",
      {
        refreshToken,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Logout (invalidate refresh token on server)
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    // Even if logout fails on server, we'll clear local tokens
    console.error("Logout error:", error);
  }
};

export default {
  register,
  login,
  refreshAccessToken,
  logout,
};
