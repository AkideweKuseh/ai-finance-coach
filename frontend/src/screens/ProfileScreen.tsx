/**
 * Profile Screen
 * User profile with stats, goals, and preferences
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  useThemedColors,
} from "../theme";
import { ScreenContainer } from "../components/common/ScreenContainer";

type Goal = "lose" | "maintain" | "gain";

const ProfileScreen = () => {
  const themedColors = useThemedColors();
  const [selectedGoal, setSelectedGoal] = useState<Goal>("maintain");
  const [activityLevel, setActivityLevel] = useState(2);
  const [dietPreferences, setDietPreferences] = useState<string[]>(["Vegan"]);

  const activityLabels = ["Sedentary", "Moderate", "Active", "Athlete"];

  const toggleDietPreference = (pref: string) => {
    if (dietPreferences.includes(pref)) {
      setDietPreferences(dietPreferences.filter((p) => p !== pref));
    } else {
      setDietPreferences([...dietPreferences, pref]);
    }
  };

  return (
    <ScreenContainer backgroundColor={themedColors.background}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: themedColors.background,
            borderBottomColor: themedColors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              color: themedColors.textPrimary,
              fontFamily: typography.fontFamily.display,
            },
          ]}
        >
          Profile
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: "https://via.placeholder.com/112" }}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editBadge}
              onPress={() => {
                // TODO: Navigate to profile update screen
                console.log("Navigate to profile update screen");
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.userName, { color: themedColors.textPrimary }]}>
            Alex Johnson
          </Text>
          <View style={styles.memberInfo}>
            <Text
              style={[styles.memberText, { color: themedColors.textSecondary }]}
            >
              Member since Jan 2024
            </Text>
            <View
              style={[
                styles.dot,
                { backgroundColor: themedColors.textSecondary },
              ]}
            />
            <View style={styles.levelBadge}>
              <Ionicons name="leaf" size={16} color={colors.primary} />
              <Text style={styles.levelText}>Level 3 Dieter</Text>
            </View>
          </View>
        </View>

        {/* The Basics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={[styles.sectionTitle, { color: themedColors.textPrimary }]}
            >
              The Basics
            </Text>
            <TouchableOpacity>
              <Text style={styles.editButton}>Edit Stats</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: themedColors.surface,
                  borderColor: themedColors.border,
                },
              ]}
            >
              <Text style={styles.statEmoji}>🎂</Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: themedColors.textSecondary },
                ]}
              >
                AGE
              </Text>
              <Text
                style={[styles.statValue, { color: themedColors.textPrimary }]}
              >
                28
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                styles.statCardHighlight,
                {
                  backgroundColor: themedColors.surface,
                  borderColor: themedColors.border,
                },
              ]}
            >
              <Text style={styles.statEmoji}>⚖️</Text>
              <Text style={styles.statLabel}>WEIGHT</Text>
              <Text
                style={[styles.statValue, { color: themedColors.textPrimary }]}
              >
                75{" "}
                <Text
                  style={[
                    styles.statUnit,
                    { color: themedColors.textSecondary },
                  ]}
                >
                  kg
                </Text>
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                {
                  backgroundColor: themedColors.surface,
                  borderColor: themedColors.border,
                },
              ]}
            >
              <Text style={styles.statEmoji}>📏</Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: themedColors.textSecondary },
                ]}
              >
                HEIGHT
              </Text>
              <Text
                style={[styles.statValue, { color: themedColors.textPrimary }]}
              >
                178 <Text style={styles.statUnit}>cm</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Main Goal */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: themedColors.textPrimary }]}
          >
            Main Goal
          </Text>
          <View
            style={[
              styles.goalsContainer,
              { backgroundColor: themedColors.surface },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.goalOption,
                {
                  backgroundColor: themedColors.surface,
                  borderColor: themedColors.border,
                },
                selectedGoal === "lose" && styles.goalOptionSelected,
              ]}
              onPress={() => setSelectedGoal("lose")}
            >
              <View style={[styles.goalIcon, styles.goalIconBlue]}>
                <Ionicons name="trending-down" size={24} color="#3B82F6" />
              </View>
              <View style={styles.goalContent}>
                <View style={styles.goalTitleRow}>
                  <Text
                    style={[
                      styles.goalTitle,
                      { color: themedColors.textPrimary },
                    ]}
                  >
                    Lose Fat
                  </Text>
                  <Text style={styles.goalEmoji}>📉</Text>
                </View>
                <Text
                  style={[
                    styles.goalDescription,
                    { color: themedColors.textSecondary },
                  ]}
                >
                  Burn calories & shed weight
                </Text>
              </View>
              <View
                style={[
                  styles.radioOuter,
                  selectedGoal === "lose" && styles.radioOuterSelected,
                ]}
              >
                {selectedGoal === "lose" && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.goalOption,
                {
                  backgroundColor: themedColors.surface,
                  borderColor: themedColors.border,
                },
                selectedGoal === "maintain" && styles.goalOptionSelected,
              ]}
              onPress={() => setSelectedGoal("maintain")}
            >
              <View style={[styles.goalIcon, styles.goalIconGreen]}>
                <Ionicons
                  name="scale-outline"
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View style={styles.goalContent}>
                <View style={styles.goalTitleRow}>
                  <Text
                    style={[
                      styles.goalTitle,
                      { color: themedColors.textPrimary },
                    ]}
                  >
                    Maintain
                  </Text>
                  <Text style={styles.goalEmoji}>🛡️</Text>
                </View>
                <Text
                  style={[
                    styles.goalDescription,
                    { color: themedColors.textSecondary },
                  ]}
                >
                  Stay healthy & fit
                </Text>
              </View>
              <View
                style={[
                  styles.radioOuter,
                  selectedGoal === "maintain" && styles.radioOuterSelected,
                ]}
              >
                {selectedGoal === "maintain" && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.goalOption,
                {
                  backgroundColor: themedColors.surface,
                  borderColor: themedColors.border,
                },
                selectedGoal === "gain" && styles.goalOptionSelected,
              ]}
              onPress={() => setSelectedGoal("gain")}
            >
              <View style={[styles.goalIcon, styles.goalIconOrange]}>
                <Ionicons name="barbell" size={24} color="#FB923C" />
              </View>
              <View style={styles.goalContent}>
                <View style={styles.goalTitleRow}>
                  <Text
                    style={[
                      styles.goalTitle,
                      { color: themedColors.textPrimary },
                    ]}
                  >
                    Build Muscle
                  </Text>
                  <Text style={styles.goalEmoji}>💪</Text>
                </View>
                <Text
                  style={[
                    styles.goalDescription,
                    { color: themedColors.textSecondary },
                  ]}
                >
                  Increase strength & mass
                </Text>
              </View>
              <View
                style={[
                  styles.radioOuter,
                  selectedGoal === "gain" && styles.radioOuterSelected,
                ]}
              >
                {selectedGoal === "gain" && (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Activity Level */}
        <View style={styles.section}>
          <View style={styles.activityHeader}>
            <Text
              style={[styles.sectionTitle, { color: themedColors.textPrimary }]}
            >
              Activity Level
            </Text>
            <View style={styles.activityBadge}>
              <Text style={styles.activityBadgeText}>
                {activityLabels[activityLevel]} 🚶
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.sliderCard,
              { backgroundColor: themedColors.surface },
            ]}
          >
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={3}
              step={1}
              value={activityLevel}
              onValueChange={setActivityLevel}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.surfaceDarkLight}
              thumbTintColor={colors.primary}
            />
            <View style={styles.sliderLabels}>
              {activityLabels.map((label, index) => (
                <Text
                  key={label}
                  style={[
                    styles.sliderLabel,
                    index === activityLevel && styles.sliderLabelActive,
                  ]}
                >
                  {label}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Dietary Preferences */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: themedColors.textPrimary }]}
          >
            Dietary Preferences
          </Text>
          <View
            style={[
              styles.preferencesContainer,
              { backgroundColor: themedColors.surface },
            ]}
          >
            {[
              { emoji: "🥦", label: "Vegan" },
              { emoji: "🥩", label: "Paleo" },
              { emoji: "🥑", label: "Keto" },
              { emoji: "🍞", label: "Gluten Free" },
            ].map((pref) => (
              <TouchableOpacity
                key={pref.label}
                style={[
                  styles.preferenceChip,
                  {
                    backgroundColor: themedColors.surfaceLight,
                    borderColor: themedColors.border,
                  },
                  dietPreferences.includes(pref.label) &&
                    styles.preferenceChipActive,
                ]}
                onPress={() => toggleDietPreference(pref.label)}
              >
                <Text style={styles.preferenceEmoji}>{pref.emoji}</Text>
                <Text
                  style={[
                    styles.preferenceLabel,
                    { color: themedColors.textPrimary },
                    dietPreferences.includes(pref.label) &&
                      styles.preferenceLabelActive,
                  ]}
                >
                  {pref.label}
                </Text>
                {dietPreferences.includes(pref.label) && (
                  <Ionicons name="close" size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[
                styles.addButton,
                { backgroundColor: themedColors.surfaceLight },
              ]}
            >
              <Ionicons
                name="add"
                size={24}
                color={themedColors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.backgroundDark,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimaryDark,
    fontFamily: typography.fontFamily.display,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimaryDark,
    fontFamily: typography.fontFamily.display,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.screenPadding,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: spacing["2xl"],
  },
  avatarContainer: {
    position: "relative",
    marginBottom: spacing.md,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: colors.surfaceDark,
    ...shadows.lg,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    borderWidth: 4,
    borderColor: colors.backgroundDark,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.lg,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimaryDark,
    marginBottom: 4,
    fontFamily: typography.fontFamily.display,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  memberText: {
    fontSize: 14,
    color: colors.textSecondaryDark,
    fontFamily: typography.fontFamily.body,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondaryDark,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  levelText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
    fontFamily: typography.fontFamily.body,
  },
  section: {
    marginBottom: spacing["2xl"],
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimaryDark,
    marginBottom: spacing.sm,
    paddingLeft: 4,
    fontFamily: typography.fontFamily.display,
  },
  editButton: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
    fontFamily: typography.fontFamily.body,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    borderRadius: radius["2xl"],
    backgroundColor: colors.surfaceDark,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    ...shadows.sm,
  },
  statCardHighlight: {
    position: "relative",
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 4,
    fontFamily: typography.fontFamily.body,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: colors.textSecondaryDark,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: typography.fontFamily.body,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimaryDark,
    marginTop: 4,
    fontFamily: typography.fontFamily.display,
  },
  statUnit: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textSecondaryDark,
    fontFamily: typography.fontFamily.body,
  },
  goalsContainer: {
    gap: 12,
  },
  goalOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius["2xl"],
    backgroundColor: colors.surfaceDark,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  goalOptionSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.md,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  goalIconBlue: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
  },
  goalIconGreen: {
    backgroundColor: `${colors.primary}33`,
  },
  goalIconOrange: {
    backgroundColor: "rgba(251, 146, 60, 0.2)",
  },
  goalContent: {
    flex: 1,
  },
  goalTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimaryDark,
    fontFamily: typography.fontFamily.display,
  },
  goalEmoji: {
    fontSize: 18,
    fontFamily: typography.fontFamily.body,
  },
  goalDescription: {
    fontSize: 14,
    color: colors.textSecondaryDark,
    marginTop: 2,
    fontFamily: typography.fontFamily.body,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.textSecondaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
    paddingHorizontal: 4,
  },
  activityBadge: {
    backgroundColor: `${colors.primary}1A`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  activityBadgeText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
    fontFamily: typography.fontFamily.body,
  },
  sliderCard: {
    padding: spacing.md,
    paddingVertical: spacing.screenPadding,
    borderRadius: radius["2xl"],
    backgroundColor: colors.surfaceDark,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingHorizontal: 8,
  },
  sliderLabel: {
    width: 64,
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondaryDark,
    textAlign: "center",
    fontFamily: typography.fontFamily.body,
  },
  sliderLabelActive: {
    color: colors.textPrimaryDark,
  },
  preferencesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  preferenceChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceDark,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  preferenceChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  preferenceEmoji: {
    fontSize: 18,
    fontFamily: typography.fontFamily.body,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimaryDark,
    fontFamily: typography.fontFamily.body,
  },
  preferenceLabelActive: {
    color: "#FFFFFF",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.textSecondaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  updateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    marginTop: spacing.xl,
    ...shadows.lg,
  },
  updateButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: typography.fontFamily.display,
  },
});

export default ProfileScreen;
