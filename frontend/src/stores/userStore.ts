/**
 * User Store - Zustand
 *
 * Manages user profile, goals, and daily summary
 */

import { create } from "zustand";
import { User, UserProfile, DailySummary } from "../types/user";

interface UserState {
  // State
  user: User | null;
  dailySummary: DailySummary | null;
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  setDailySummary: (summary: DailySummary) => void;
  clearUser: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useUserStore = create<UserState>((set: any) => ({
  // Initial state
  user: null,
  dailySummary: null,
  isLoading: false,

  /**
   * Set user data
   */
  setUser: (user: User) => {
    set({ user, isLoading: false });
  },

  /**
   * Update user profile (partial update)
   */
  updateProfile: (profile: Partial<UserProfile>) => {
    set((state: any) => {
      if (!state.user) return state;

      return {
        user: {
          ...state.user,
          profile: {
            ...state.user.profile,
            ...profile,
          },
        },
      };
    });
  },

  /**
   * Set daily calorie and macro summary
   */
  setDailySummary: (summary: DailySummary) => {
    set({ dailySummary: summary });
  },

  /**
   * Clear user data (logout)
   */
  clearUser: () => {
    set({
      user: null,
      dailySummary: null,
      isLoading: false,
    });
  },

  /**
   * Set loading state
   */
  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },
}));

export default useUserStore;
