/**
 * API Client - Axios instance with interceptors
 *
 * Handles JWT token injection, refresh, and error handling.
 * Uses a refresh queue so only one token refresh runs at a time;
 * all other 401s wait for it rather than firing concurrent refresh attempts.
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

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:5000/api";

// ── Refresh-queue state (module-level singletons) ────────────────────────────
let isRefreshing = false;
let waitingForRefresh: Array<(newToken: string | null) => void> = [];

const drainQueue = (newToken: string | null) => {
  waitingForRefresh.forEach((cb) => cb(newToken));
  waitingForRefresh = [];
};
// ────────────────────────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — inject access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 with refresh queue
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If a refresh is already in flight, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waitingForRefresh.push((newToken) => {
          if (!newToken) { reject(error); return; }
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }
          resolve(apiClient(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { refreshToken } = useAuthStore.getState();

      if (!refreshToken) {
        isRefreshing = false;
        drainQueue(null);
        return Promise.reject(error);
      }

      const response = await axios.post<
        ApiResponse<{ accessToken: string; refreshToken: string }>
      >(`${API_BASE_URL}/auth/refresh`, { refreshToken });

      const tokenPair = response.data?.data;

      if (!tokenPair?.accessToken || !tokenPair?.refreshToken) {
        throw new Error(response.data?.message || "Invalid refresh response");
      }

      await useAuthStore
        .getState()
        .setTokens(tokenPair.accessToken, tokenPair.refreshToken);

      // Let queued requests proceed with the new token
      drainQueue(tokenPair.accessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${tokenPair.accessToken}`;
      }
      return apiClient(originalRequest);
    } catch (refreshError) {
      drainQueue(null);
      await useAuthStore.getState().clearTokens();
      console.error("Token refresh failed:", refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data: any = error.response.data;
      if (Array.isArray(data?.errors) && data.errors.length > 0) {
        const first = data.errors[0];
        const msg = first?.msg || first?.message;
        if (typeof msg === "string" && msg.trim().length > 0) return msg;
      }
      return data?.message || error.response.statusText || "An error occurred";
    } else if (error.request) {
      return "Network error. Please check your connection.";
    }
  }
  return "An unexpected error occurred";
};

export default apiClient;
