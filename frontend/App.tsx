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
import { useAuthStore } from "./src/stores/authStore";
import { useThemeStore } from "./src/stores/themeStore";

export default function App() {
  const { loadTokens } = useAuthStore();
  const { loadTheme, isDark } = useThemeStore();

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
    if (fontError) {
      console.error("Font loading error:", fontError);
    }
  }, [fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? "light" : "dark"} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
