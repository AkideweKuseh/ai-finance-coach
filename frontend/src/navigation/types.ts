/**
 * Navigation Type Definitions
 */

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";

/**
 * Root Stack Navigator (Authentication Flow)
 */
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  MealDetail: { mealId: string };
};

export type AuthStackParamList = {
  Landing: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

/**
 * Main Tab Navigator (Authenticated User)
 */
export type MainTabParamList = {
  Dashboard: undefined;
  AIChat: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

/**
 * Meal Stack Navigator
 */
export type MealStackParamList = {
  MealList: undefined;
  MealDetail: { mealId: string };
};

export type MealStackScreenProps<T extends keyof MealStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<MealStackParamList, T>,
    MainTabScreenProps<keyof MainTabParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
