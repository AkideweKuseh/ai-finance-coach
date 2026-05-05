/**
 * App.tsx - Main Application Entry Point
 *
 * Initializes the app, loads fonts, and sets up navigation
 */

import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  RobotoMono_400Regular,
  RobotoMono_500Medium,
  RobotoMono_600SemiBold,
  RobotoMono_700Bold,
} from "@expo-google-fonts/roboto-mono";
import AppNavigator from "./src/navigation/AppNavigator";
import { AppAlertModal } from "./src/components/common/AppAlertModal";
import { useAuthStore } from "./src/stores/authStore";
import { useThemeStore } from "./src/stores/themeStore";
import { useUserStore } from "./src/stores/userStore";
import * as userApi from "./src/api/user";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import apiClient from "./src/api/client";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const { loadTokens, isAuthenticated } = useAuthStore();
  const { loadTheme, isDark } = useThemeStore();
  const { user, setUser, spendingSummary, setSpendingSummary } = useUserStore();

  const [fontsLoaded, fontError] = useFonts({
    "RobotoMono-Regular": RobotoMono_400Regular,
    "RobotoMono-Medium": RobotoMono_500Medium,
    "RobotoMono-SemiBold": RobotoMono_600SemiBold,
    "RobotoMono-Bold": RobotoMono_700Bold,
  });

  useEffect(() => {
    // Load stored auth tokens and theme on app start
    loadTokens();
    loadTheme();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      if (!isAuthenticated) return;

      try {
        if (!user) {
          const profile = await userApi.getProfile();
          if (!cancelled) setUser(profile);
        }

        if (!spendingSummary) {
          const summary = await userApi.getSpendingSummary();
          if (!cancelled) setSpendingSummary(summary);
        }
      } catch (e) {
        // Best-effort hydration; screens can still render with defaults.
      }
    };

    hydrate();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, user, spendingSummary, setUser, setSpendingSummary]);

  useEffect(() => {
    if (fontError) {
      console.error("Font loading error:", fontError);
    }
  }, [fontError]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const registerPushToken = async () => {
      try {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") return;

        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
        await apiClient.post("/user/push-token", { pushToken: tokenData.data });
      } catch (err) {
        console.warn("Push token registration failed:", err);
      }
    };

    registerPushToken();
  }, [isAuthenticated]);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as any;
      if (data?.screen === "WeeklyReport" && data?.reportId) {
        // Navigation handled by OS when app is backgrounded; foreground case noted for future nav ref
        console.log("[Notification] WeeklyReport deep-link received:", data.reportId);
      }
    });
    return () => sub.remove();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? "light" : "dark"} />
      <AppNavigator />
      <AppAlertModal />
    </SafeAreaProvider>
  );
}
