/**
 * Dashboard Screen
 * Main home screen showing daily calorie progress, macros, and recommendations
 */

import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  useThemedColors,
} from "../theme";
import Svg, { Circle } from "react-native-svg";
import { ScreenContainer } from "../components/common/ScreenContainer";
import { useUserStore } from "../stores/userStore";

interface MacroBarProps {
  label: string;
  remaining: string;
  progress: number;
  isProtein?: boolean;
}

const MacroBar = ({ label, remaining, progress, isProtein }: MacroBarProps) => {
  const themedColors = useThemedColors();
  return (
    <View style={styles.macroContainer}>
      <View style={styles.macroHeader}>
        <Text style={[styles.macroLabel, { color: themedColors.textPrimary }]}>
          {label}
        </Text>
        <Text
          style={[
            styles.macroRemaining,
            { color: themedColors.textSecondary },
            isProtein && styles.macroRemainingProtein,
          ]}
        >
          {remaining}
        </Text>
      </View>
      <View
        style={[
          styles.macroBarTrack,
          { backgroundColor: themedColors.surfaceLight },
        ]}
      >
        <View
          style={[
            styles.macroBarFill,
            { width: `${progress}%` },
            isProtein && styles.macroBarFillProtein,
          ]}
        />
      </View>
    </View>
  );
};

interface QuickActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  isPrimary?: boolean;
  onPress?: () => void;
}

const QuickAction = ({ icon, label, isPrimary, onPress }: QuickActionProps) => {
  const themedColors = useThemedColors();
  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        { backgroundColor: themedColors.surface },
        isPrimary && styles.actionButtonPrimary,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={icon}
        size={28}
        color={isPrimary ? "#FFFFFF" : "#F9A825"}
      />
      <Text
        style={[
          styles.actionLabel,
          { color: themedColors.textPrimary },
          isPrimary && styles.actionLabelPrimary,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

interface MealCardProps {
  title: string;
  calories: string;
  protein: string;
  badge: string;
  isAIPick?: boolean;
  imageUrl: string;
  onAdd?: () => void;
}

const MealCard = ({
  title,
  calories,
  protein,
  badge,
  isAIPick,
  imageUrl,
  onAdd,
}: MealCardProps) => {
  const navigation = useNavigation();
  const themedColors = useThemedColors();

  return (
    <TouchableOpacity
      style={[
        styles.mealCard,
        {
          backgroundColor: themedColors.surface,
          borderColor: themedColors.border,
        },
      ]}
      onPress={() => {
        // @ts-ignore - Navigation typing
        navigation.navigate("MealDetail", { mealId: "1" });
      }}
      activeOpacity={0.7}
    >
      <Image source={{ uri: imageUrl }} style={styles.mealImage} />
      <View style={styles.mealContent}>
        <View style={styles.mealBadges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
          {isAIPick && (
            <View style={styles.badgeAI}>
              <Ionicons name="sparkles" size={10} color="#F9A825" />
              <Text style={styles.badgeAIText}>AI Pick</Text>
            </View>
          )}
        </View>
        <Text
          style={[styles.mealTitle, { color: themedColors.textPrimary }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text style={[styles.mealStats, { color: themedColors.textSecondary }]}>
          {calories} • {protein}
        </Text>
      </View>
      <TouchableOpacity
        style={[
          styles.addButton,
          { backgroundColor: themedColors.surfaceLight },
        ]}
        onPress={onAdd}
      >
        <Ionicons name="add" size={20} color={themedColors.textPrimary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const DashboardScreen = () => {
  const themedColors = useThemedColors();
  const { user, dailySummary } = useUserStore();

  const firstName = user?.name?.split(" ")?.[0] || "there";

  const targetCalories = user?.profile?.dailyCalorieGoal ?? 2000;
  const currentCalories = dailySummary?.caloriesConsumed ?? 0;
  const progress = Math.min(
    100,
    Math.max(0, (currentCalories / Math.max(1, targetCalories)) * 100)
  );

  const macroUi = useMemo(() => {
    const macroGoals = user?.profile?.macroGoals;
    const consumed = dailySummary?.macrosConsumed;
    const remaining = dailySummary?.macrosRemaining;

    const proteinGoal = macroGoals?.protein ?? 0;
    const carbsGoal = macroGoals?.carbs ?? 0;
    const fatGoal = macroGoals?.fat ?? 0;

    const proteinConsumed = consumed?.protein ?? 0;
    const carbsConsumed = consumed?.carbs ?? 0;
    const fatConsumed = consumed?.fat ?? 0;

    const proteinLeft =
      remaining?.protein ?? Math.max(0, proteinGoal - proteinConsumed);
    const carbsLeft =
      remaining?.carbs ?? Math.max(0, carbsGoal - carbsConsumed);
    const fatLeft = remaining?.fat ?? Math.max(0, fatGoal - fatConsumed);

    const pct = (value: number, goal: number) =>
      Math.min(100, Math.max(0, (value / Math.max(1, goal)) * 100));

    return {
      protein: {
        left: proteinLeft,
        progress: pct(proteinConsumed, proteinGoal),
      },
      carbs: { left: carbsLeft, progress: pct(carbsConsumed, carbsGoal) },
      fat: { left: fatLeft, progress: pct(fatConsumed, fatGoal) },
    };
  }, [user, dailySummary]);

  // Calculate circle progress (circumference = 2πr, r=80)
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getCurrentDate = () => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const now = new Date();
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
  };

  return (
    <ScreenContainer
      backgroundColor={themedColors.background}
      withKeyboardAvoidingView={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text
            style={[styles.dateText, { color: themedColors.textSecondary }]}
          >
            {getCurrentDate()}
          </Text>
          <Text style={[styles.greeting, { color: themedColors.textPrimary }]}>
            Good morning, {firstName}! 🥑
          </Text>
        </View>
        <View
          style={[styles.avatar, { backgroundColor: themedColors.surface }]}
        >
          <Ionicons name="person" size={24} color={colors.primary} />
        </View>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Summary Card */}
        <View
          style={[styles.heroCard, { backgroundColor: themedColors.surface }]}
        >
          <View style={styles.progressRingContainer}>
            {/* SVG Progress Ring */}
            <Svg width={240} height={240} style={styles.progressRing}>
              {/* Background Circle */}
              <Circle
                cx="120"
                cy="120"
                r={radius}
                stroke={themedColors.surfaceLight}
                strokeWidth="16"
                fill="transparent"
              />
              {/* Progress Circle */}
              <Circle
                cx="120"
                cy="120"
                r={radius}
                stroke={colors.primary}
                strokeWidth="16"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation="-90"
                origin="120, 120"
              />
            </Svg>

            {/* Inner Content */}
            <View style={styles.progressContent}>
              <Text
                style={[
                  styles.caloriesCurrent,
                  { color: themedColors.textPrimary },
                ]}
              >
                {currentCalories.toLocaleString()}
              </Text>
              <Text
                style={[
                  styles.caloriesTarget,
                  { color: themedColors.textSecondary },
                ]}
              >
                {targetCalories.toLocaleString()} kcal
              </Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>On Track</Text>
              </View>
            </View>
          </View>

          {/* Macro Bars */}
          <View style={styles.macrosContainer}>
            <MacroBar
              label="Protein"
              remaining={`${macroUi.protein.left}g left`}
              progress={macroUi.protein.progress}
              isProtein
            />
            <MacroBar
              label="Carbs"
              remaining={`${macroUi.carbs.left}g left`}
              progress={macroUi.carbs.progress}
            />
            <MacroBar
              label="Fat"
              remaining={`${macroUi.fat.left}g left`}
              progress={macroUi.fat.progress}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: themedColors.textPrimary }]}
          >
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <QuickAction
              icon="chatbubble-ellipses"
              label="Ask Coach"
              isPrimary
            />
            <QuickAction icon="camera" label="Snap Meal" />
            <QuickAction icon="create" label="Text Log" />
          </View>
        </View>

        {/* Recommended Meals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={[styles.sectionTitle, { color: themedColors.textPrimary }]}
            >
              Recommended for You
            </Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mealsContainer}>
            <MealCard
              title="Quinoa Power Salad"
              calories="450 kcal"
              protein="18g Protein"
              badge="LUNCH"
              isAIPick
              imageUrl="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400"
            />
            <MealCard
              title="Greek Yogurt & Berries"
              calories="120 kcal"
              protein="12g Protein"
              badge="SNACK"
              imageUrl="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400"
            />
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  dateText: {
    fontSize: 14,
    color: colors.textSecondaryDark,
    fontWeight: "500",
    marginBottom: 4,
    fontFamily: typography.fontFamily.body,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimaryDark,
    lineHeight: 28,
    fontFamily: typography.fontFamily.display,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceDark,
    borderWidth: 2,
    borderColor: `${colors.primary}33`,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  heroCard: {
    backgroundColor: colors.surfaceDark,
    borderRadius: radius["3xl"],
    padding: spacing.screenPadding,
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  progressRingContainer: {
    alignItems: "center",
    marginBottom: spacing.screenPadding,
  },
  progressRing: {
    position: "absolute",
  },
  progressContent: {
    width: 240,
    height: 240,
    alignItems: "center",
    justifyContent: "center",
  },
  caloriesCurrent: {
    fontSize: 40,
    fontWeight: "800",
    color: colors.textPrimaryDark,
    letterSpacing: -1,
    fontFamily: typography.fontFamily.display,
  },
  caloriesTarget: {
    fontSize: 14,
    color: colors.textSecondaryDark,
    fontWeight: "500",
    marginTop: 2,
    fontFamily: typography.fontFamily.body,
  },
  statusBadge: {
    backgroundColor: `${colors.primary}1A`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginTop: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    fontFamily: typography.fontFamily.display,
  },
  macrosContainer: {
    gap: spacing.md,
  },
  macroContainer: {
    gap: 6,
  },
  macroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  macroLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimaryDark,
    fontFamily: typography.fontFamily.body,
  },
  macroRemaining: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textSecondaryDark,
    fontFamily: typography.fontFamily.display,
  },
  macroRemainingProtein: {
    color: "#F9A825",
  },
  macroBarTrack: {
    height: 10,
    backgroundColor: colors.surfaceDarkLight,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  macroBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  macroBarFillProtein: {
    backgroundColor: "#F9A825",
  },
  section: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimaryDark,
    marginBottom: spacing.md,
    paddingLeft: 4,
    fontFamily: typography.fontFamily.display,
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
    fontFamily: typography.fontFamily.display,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    backgroundColor: colors.surfaceDark,
    padding: spacing.md,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: `${colors.textPrimaryDark}0D`,
  },
  actionButtonPrimary: {
    backgroundColor: colors.primary,
    borderWidth: 0,
    ...shadows.lg,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimaryDark,
    fontFamily: typography.fontFamily.display,
  },
  actionLabelPrimary: {
    color: "#FFFFFF",
  },
  mealsContainer: {
    gap: 12,
  },
  mealCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surfaceDark,
    padding: 12,
    paddingRight: spacing.md,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: `${colors.textPrimaryDark}0D`,
    ...shadows.sm,
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceDarkLight,
  },
  mealContent: {
    flex: 1,
    gap: 4,
  },
  mealBadges: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 2,
  },
  badge: {
    backgroundColor: `${colors.primary}1A`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: typography.fontFamily.display,
  },
  badgeAI: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F9A8251A",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeAIText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#F9A825",
    fontFamily: typography.fontFamily.display,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimaryDark,
    lineHeight: 20,
    fontFamily: typography.fontFamily.display,
  },
  mealStats: {
    fontSize: 14,
    color: colors.textSecondaryDark,
    fontFamily: typography.fontFamily.body,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceDarkLight,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DashboardScreen;
