/**
 * API Client - Axios instance with interceptors
 *
 * Handles JWT token injection, refresh, and error handling
 */

import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { useAuthStore } from "../stores/authStore";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
};

// Base API URL from environment
// NOTE: For Expo, only variables prefixed with EXPO_PUBLIC_ are available at runtime.
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:5000/api";

/**
 * Create Axios instance with default config
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor - Add JWT token to requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle token refresh
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If 401 and haven't retried, attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = useAuthStore.getState();

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Request new access token
        const response = await axios.post<
          ApiResponse<{
            accessToken: string;
            refreshToken: string;
          }>
        >(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const tokenPair = response.data?.data;

        if (!tokenPair?.accessToken || !tokenPair?.refreshToken) {
          throw new Error(response.data?.message || "Invalid refresh response");
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          tokenPair;

        // Update tokens in store
        await useAuthStore
          .getState()
          .setTokens(newAccessToken, newRefreshToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        await useAuthStore.getState().clearTokens();

        // Could redirect to login here or emit an event
        console.error("Token refresh failed:", refreshError);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to handle API errors
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data: any = error.response.data;

      // Backend validation middleware returns { success:false, message:"Validation failed", errors:[...] }
      if (Array.isArray(data?.errors) && data.errors.length > 0) {
        const first = data.errors[0];
        const msg = first?.msg || first?.message;
        if (typeof msg === "string" && msg.trim().length > 0) {
          return msg;
        }
      }

      // Server responded with error
      return data?.message || error.response.statusText || "An error occurred";
    } else if (error.request) {
      // Request made but no response
      return "Network error. Please check your connection.";
    }
  }

  return "An unexpected error occurred";
};

export default apiClient;
