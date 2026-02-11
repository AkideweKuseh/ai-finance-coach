/**
 * App Navigator
 *
 * Main navigation structure for the app
 */

import React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { colors, useThemedColors } from "../theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Import screens
import AuthNavigator from "./AuthNavigator";
import DashboardScreen from "../screens/DashboardScreen";
import AIChatScreen from "../screens/AIChatScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SettingsScreen from "../screens/SettingsScreen";
import TransactionDetailScreen from "../screens/TransactionDetailScreen";
import LogTransactionScreen from "../screens/LogTransactionScreen";

import { RootStackParamList, MainTabParamList } from "./types";
import { useAuthStore } from "../stores/authStore";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

/**
 * Main Tab Navigator (for authenticated users)
 */
const MainTabNavigator = () => {
  const themedColors = useThemedColors();
  const insets = useSafeAreaInsets();
  const androidBottomInset = Platform.OS === "android" ? insets.bottom : 0;
  const tabBarBaseHeight = 68;
  const tabBarPaddingBottom = 12 + androidBottomInset;
  const tabBarHeight = tabBarBaseHeight + androidBottomInset;
  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: themedColors.textSecondary,
        tabBarStyle: {
          backgroundColor: themedColors.surface,
          borderTopColor: themedColors.border,
          borderTopWidth: 1,
          paddingBottom: tabBarPaddingBottom,
          paddingTop: 10,
          height: tabBarHeight,
          elevation: 0,
          shadowOpacity: 0,
          position: "absolute",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
      }}
    >
      <MainTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <MainTab.Screen
        name="AIChat"
        component={AIChatScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
          tabBarLabel: "Coach",
        }}
      />
      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          tabBarLabel: "Profile",
        }}
      />
      <MainTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
          tabBarLabel: "Settings",
        }}
      />
    </MainTab.Navigator>
  );
};

/**
 * Root Navigator (handles auth state)
 */
const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return null; // Could show splash screen here
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <RootStack.Screen name="Main" component={MainTabNavigator} />
          <RootStack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
          <RootStack.Screen 
            name="LogTransaction" 
            component={LogTransactionScreen} 
            options={{ presentation: 'modal' }}
          />
        </>
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

/**
 * App Navigator Component
 */
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
