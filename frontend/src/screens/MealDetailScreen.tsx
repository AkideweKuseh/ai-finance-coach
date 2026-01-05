/**
 * Meal Detail Screen
 * Displays detailed recipe information with ingredients and preparation steps
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
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
import { LinearGradient } from "expo-linear-gradient";

interface Ingredient {
  name: string;
  amount: string;
  checked: boolean;
}

interface Step {
  number: number;
  title: string;
  description: string;
}

const MealDetailScreen = () => {
  const navigation = useNavigation();
  const themedColors = useThemedColors();
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "Chicken Breast", amount: "2 (400g)", checked: true },
    { name: "Fresh Lemon", amount: "1 whole", checked: false },
    { name: "Olive Oil", amount: "2 tbsp", checked: false },
    { name: "Fresh Thyme", amount: "3 sprigs", checked: false },
  ]);

  const steps: Step[] = [
    {
      number: 1,
      title: "Marinate Chicken",
      description:
        "Combine olive oil, lemon juice, minced garlic, and herbs in a bowl. Add chicken and let sit for 15 mins.",
    },
    {
      number: 2,
      title: "Preheat Grill",
      description:
        "Heat your grill pan over medium-high heat. Brush with a little oil to prevent sticking.",
    },
    {
      number: 3,
      title: "Cook to Perfection",
      description:
        "Grill chicken for 6-8 minutes per side until golden brown and internal temp reaches 165°F (75°C).",
    },
  ];

  const toggleIngredient = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients[index].checked = !newIngredients[index].checked;
    setIngredients(newIngredients);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themedColors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800",
          }}
          style={styles.heroImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={[
              "rgba(0,0,0,0.3)",
              "rgba(0,0,0,0.5)",
              colors.backgroundDark,
            ]}
            style={styles.heroOverlay}
          >
            {/* Top Navigation */}
            <View style={styles.topNav}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.navRight}>
                <TouchableOpacity style={styles.navButton}>
                  <Ionicons name="heart-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButton}>
                  <Ionicons name="share-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Hero Content */}
            <View style={styles.heroContent}>
              <View style={styles.badgesRow}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>HIGH PROTEIN</Text>
                </View>
                <View style={[styles.badge, styles.badgeOrange]}>
                  <Text style={styles.badgeText}>UNDER 30 MINS</Text>
                </View>
              </View>
              <Text style={styles.heroTitle}>
                Grilled Lemon Herb{"\n"}Chicken Breast
              </Text>
              <View style={styles.heroMeta}>
                <Ionicons name="star" size={18} color="#FB923C" />
                <Text style={styles.heroRating}>4.8</Text>
                <Text style={styles.heroDivider}>•</Text>
                <Text style={styles.heroMetaText}>25 mins</Text>
                <Text style={styles.heroDivider}>•</Text>
                <Text style={styles.heroMetaText}>Easy prep</Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        <View
          style={[styles.content, { backgroundColor: themedColors.background }]}
        >
          {/* AI Insight Card */}
          <View
            style={[
              styles.aiCard,
              {
                backgroundColor: themedColors.isDark
                  ? "rgba(34, 139, 34, 0.15)"
                  : "rgba(76, 175, 80, 0.1)",
                borderColor: themedColors.isDark
                  ? "rgba(76, 175, 80, 0.3)"
                  : "rgba(76, 175, 80, 0.4)",
              },
            ]}
          >
            <View style={styles.aiIconContainer}>
              <Ionicons name="flash" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.aiContent}>
              <Text style={styles.aiTitle}>AI INSIGHT</Text>
              <Text
                style={[styles.aiText, { color: themedColors.textPrimary }]}
              >
                This meal hits{" "}
                <Text
                  style={[
                    styles.aiHighlight,
                    { color: themedColors.isDark ? "#FFFFFF" : colors.primary },
                  ]}
                >
                  80% of your daily protein goal!
                </Text>{" "}
                Perfect for post-workout muscle recovery.
              </Text>
            </View>
            <View style={styles.aiBlob} />
          </View>

          {/* Macros Grid */}
          <View style={styles.macrosGrid}>
            <View
              style={[
                styles.macroCard,
                {
                  backgroundColor: themedColors.surface,
                  borderColor: themedColors.border,
                },
              ]}
            >
              <Text
                style={[styles.macroValue, { color: themedColors.textPrimary }]}
              >
                520
              </Text>
              <Text
                style={[
                  styles.macroLabel,
                  { color: themedColors.textSecondary },
                ]}
              >
                Kcal 🔥
              </Text>
            </View>
            <View
              style={[
                styles.macroCard,
                styles.macroCardHighlight,
                {
                  backgroundColor: themedColors.surface,
                  borderColor: themedColors.border,
                },
              ]}
            >
              <Text style={[styles.macroValue, styles.macroValueGreen]}>
                45g
              </Text>
              <Text
                style={[
                  styles.macroLabel,
                  { color: themedColors.textSecondary },
                ]}
              >
                Prot 🥩
              </Text>
            </View>
            <View
              style={[
                styles.macroCard,
                {
                  backgroundColor: themedColors.surface,
                  borderColor: themedColors.border,
                },
              ]}
            >
              <Text
                style={[styles.macroValue, { color: themedColors.textPrimary }]}
              >
                12g
              </Text>
              <Text
                style={[
                  styles.macroLabel,
                  { color: themedColors.textSecondary },
                ]}
              >
                Carbs 🍞
              </Text>
            </View>
            <View
              style={[
                styles.macroCard,
                {
                  backgroundColor: themedColors.surface,
                  borderColor: themedColors.border,
                },
              ]}
            >
              <Text
                style={[styles.macroValue, { color: themedColors.textPrimary }]}
              >
                20g
              </Text>
              <Text
                style={[
                  styles.macroLabel,
                  { color: themedColors.textSecondary },
                ]}
              >
                Fat 🥑
              </Text>
            </View>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: themedColors.textPrimary },
                ]}
              >
                Ingredients
              </Text>
              <Text
                style={[
                  styles.itemsCountText,
                  { color: themedColors.textSecondary },
                ]}
              >
                4 items
              </Text>
            </View>
            <View
              style={[
                styles.ingredientsList,
                {
                  backgroundColor: themedColors.surface,
                  borderColor: themedColors.border,
                },
              ]}
            >
              {ingredients.map((ingredient, index) => (
                <React.Fragment key={index}>
                  <TouchableOpacity
                    style={styles.ingredientItem}
                    onPress={() => toggleIngredient(index)}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        { borderColor: themedColors.textSecondary },
                        ingredient.checked && styles.checkboxChecked,
                      ]}
                    >
                      {ingredient.checked && (
                        <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                      )}
                    </View>
                    <View style={styles.ingredientContent}>
                      <Text
                        style={[
                          styles.ingredientName,
                          { color: themedColors.textPrimary },
                          ingredient.checked && styles.ingredientNameChecked,
                        ]}
                      >
                        {ingredient.name}
                      </Text>
                      <Text
                        style={[
                          styles.ingredientAmount,
                          { color: themedColors.textSecondary },
                        ]}
                      >
                        {ingredient.amount}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {index < ingredients.length - 1 && (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: themedColors.border },
                      ]}
                    />
                  )}
                </React.Fragment>
              ))}
            </View>
            <TouchableOpacity style={styles.showLessButton}>
              <Text
                style={[
                  styles.showLessText,
                  { color: themedColors.textSecondary },
                ]}
              >
                Show less
              </Text>
              <Ionicons
                name="chevron-up"
                size={16}
                color={themedColors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Preparation Steps */}
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: themedColors.textPrimary }]}
            >
              Preparation
            </Text>
            {steps.map((step, index) => (
              <View key={step.number} style={styles.stepContainer}>
                <View style={styles.stepLeft}>
                  <View
                    style={[
                      styles.stepNumber,
                      {
                        backgroundColor: themedColors.surface,
                        borderColor: themedColors.border,
                      },
                      step.number === 1 && styles.stepNumberActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepNumberText,
                        { color: themedColors.textSecondary },
                        step.number === 1 && styles.stepNumberTextActive,
                      ]}
                    >
                      {step.number}
                    </Text>
                  </View>
                  {index < steps.length - 1 && (
                    <View
                      style={[
                        styles.stepLine,
                        { backgroundColor: themedColors.border },
                      ]}
                    />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text
                    style={[
                      styles.stepTitle,
                      { color: themedColors.textPrimary },
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text
                    style={[
                      styles.stepDescription,
                      { color: themedColors.textSecondary },
                    ]}
                  >
                    {step.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: themedColors.background,
            borderTopColor: themedColors.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.bookmarkButton,
            {
              backgroundColor: themedColors.surface,
              borderColor: themedColors.border,
            },
          ]}
        >
          <Ionicons name="bookmark" size={24} color="#FB923C" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle" size={24} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add to Daily Log</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  scrollView: {
    flex: 1,
  },
  heroImage: {
    width: "100%",
    height: 380,
    borderBottomLeftRadius: radius["3xl"],
    borderBottomRightRadius: radius["3xl"],
    overflow: "hidden",
  },
  heroOverlay: {
    flex: 1,
    paddingTop: spacing.xl + spacing.md,
    borderBottomLeftRadius: radius["3xl"],
    borderBottomRightRadius: radius["3xl"],
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    marginBottom: "auto",
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  navRight: {
    flexDirection: "row",
    gap: 12,
  },
  heroContent: {
    padding: spacing.lg,
    paddingBottom: spacing["2xl"],
  },
  badgesRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    backgroundColor: `${colors.primary}E6`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  badgeOrange: {
    backgroundColor: "rgba(251, 146, 60, 0.9)",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    fontFamily: typography.fontFamily.display,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 38,
    marginBottom: 8,
    fontFamily: typography.fontFamily.display,
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  heroRating: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
    fontFamily: typography.fontFamily.body,
  },
  heroDivider: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginHorizontal: 2,
    fontFamily: typography.fontFamily.body,
  },
  heroMetaText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontFamily: typography.fontFamily.body,
  },
  content: {
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  aiCard: {
    position: "relative",
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    paddingVertical: 16,
    borderRadius: radius["2xl"],
    backgroundColor: "rgba(34, 139, 34, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.3)",
    marginBottom: spacing.screenPadding,
    overflow: "hidden",
  },
  aiIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
  },
  aiContent: {
    flex: 1,
    gap: 4,
  },
  aiTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4caf50",
    letterSpacing: 0.5,
    fontFamily: typography.fontFamily.display,
  },
  aiText: {
    fontSize: 14,
    color: colors.textPrimaryDark,
    lineHeight: 20,
    fontFamily: typography.fontFamily.body,
  },
  aiHighlight: {
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: typography.fontFamily.display,
  },
  aiBlob: {
    position: "absolute",
    right: -16,
    bottom: -32,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${colors.primary}33`,
  },
  macrosGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: spacing.screenPadding,
  },
  macroCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 16,
    paddingVertical: 18,
    borderRadius: radius["2xl"],
    backgroundColor: "#1E1F22",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  macroCardHighlight: {
    borderColor: `${colors.primary}33`,
    backgroundColor: `${colors.primary}0D`,
  },
  macroValue: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.textPrimaryDark,
    fontFamily: typography.fontFamily.display,
  },
  macroValueGreen: {
    color: "#4caf50",
  },
  macroLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.textSecondaryDark,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: typography.fontFamily.body,
  },
  section: {
    marginBottom: spacing["2xl"],
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimaryDark,
    fontFamily: typography.fontFamily.display,
  },
  itemsCountText: {
    fontSize: 13,
    fontWeight: "400",
    color: colors.textSecondaryDark,
    fontFamily: typography.fontFamily.body,
  },
  ingredientsList: {
    backgroundColor: colors.surfaceDark,
    borderRadius: radius["2xl"],
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: 12,
    borderRadius: radius.xl,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.textSecondaryDark,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  ingredientContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ingredientName: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textPrimaryDark,
    fontFamily: typography.fontFamily.body,
  },
  ingredientNameChecked: {
    opacity: 0.5,
    textDecorationLine: "line-through",
  },
  ingredientAmount: {
    fontSize: 14,
    color: colors.textSecondaryDark,
    fontFamily: typography.fontFamily.body,
  },
  showLessButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 12,
    marginTop: 8,
  },
  showLessText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondaryDark,
    fontFamily: typography.fontFamily.body,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginHorizontal: 8,
  },
  stepContainer: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.screenPadding,
  },
  stepLeft: {
    alignItems: "center",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceDark,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberActive: {
    backgroundColor: "rgba(251, 146, 60, 0.2)",
    borderColor: "transparent",
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textSecondaryDark,
    fontFamily: typography.fontFamily.display,
  },
  stepNumberTextActive: {
    color: "#FB923C",
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 8,
  },
  stepContent: {
    flex: 1,
    paddingBottom: spacing.md,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimaryDark,
    marginBottom: 4,
    fontFamily: typography.fontFamily.display,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textSecondaryDark,
    lineHeight: 20,
    fontFamily: typography.fontFamily.body,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: spacing.md,
    paddingBottom: spacing.screenPadding,
    backgroundColor: `${colors.backgroundDark}CC`,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  bookmarkButton: {
    width: 56,
    height: 56,
    borderRadius: radius["2xl"],
    backgroundColor: colors.surfaceDark,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.lg,
  },
  addButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    height: 56,
    borderRadius: radius["2xl"],
    backgroundColor: colors.primary,
    ...shadows.lg,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: typography.fontFamily.display,
  },
});

export default MealDetailScreen;
