/**
 * Profile Screen
 * User financial profile with details, goals, and risk tolerance
 */

import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  useThemedColors,
} from "../theme";
import { ScreenContainer } from "../components/common/ScreenContainer";
import { useUserStore } from "../stores/userStore";

type FinancialGoal = "save_emergency" | "pay_debt" | "invest" | "budget_control";
type RiskTolerance = "conservative" | "moderate" | "aggressive";

const ProfileScreen = () => {
  const themedColors = useThemedColors();
  const { user, updateProfile } = useUserStore();
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal>("save_emergency");
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>("moderate");
  const [spendingCategories, setSpendingCategories] = useState<string[]>([]);

  // Update local state when user loads
  useEffect(() => {
    if (!user?.profile) return;
    if (user.profile.primaryGoal) setSelectedGoal(user.profile.primaryGoal);
    if (user.profile.riskTolerance) setRiskTolerance(user.profile.riskTolerance);
    if (user.profile.spendingCategories) setSpendingCategories(user.profile.spendingCategories);
  }, [user]);

  // Handle updates
  const handleGoalChange = (goal: FinancialGoal) => {
      setSelectedGoal(goal);
      updateProfile({ primaryGoal: goal });
  };

  const handleRiskChange = (risk: RiskTolerance) => {
      setRiskTolerance(risk);
      updateProfile({ riskTolerance: risk });
  };
  
  const toggleCategory = (cat: string) => {
      let newCats;
      if (spendingCategories.includes(cat)) {
          newCats = spendingCategories.filter(c => c !== cat);
      } else {
          newCats = [...spendingCategories, cat];
      }
      setSpendingCategories(newCats);
      updateProfile({ spendingCategories: newCats });
  };

  const memberSinceLabel = useMemo(() => {
    if (!user?.createdAt) return undefined;
    const d = new Date(user.createdAt);
    return `Member since ${d.toLocaleDateString()}`;
  }, [user?.createdAt]);

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
              source={{ uri: "https://ui-avatars.com/api/?name=" + (user?.name || "User") + "&background=2D9CDB&color=fff" }}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editBadge}
              onPress={() => console.log("Edit avatar")}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.userName, { color: themedColors.textPrimary }]}>
            {user?.name || "Financial User"}
          </Text>
          <View style={styles.memberInfo}>
            <Text
              style={[styles.memberText, { color: themedColors.textSecondary }]}
            >
              {memberSinceLabel || "Just joined"}
            </Text>
          </View>
        </View>

        {/* The Basics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={[styles.sectionTitle, { color: themedColors.textPrimary }]}
            >
              Financial Stats
            </Text>
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
              <Text style={[styles.statLabel, { color: themedColors.textSecondary }]}>AGE</Text>
              <Text style={[styles.statValue, { color: themedColors.textPrimary }]}>
                {user?.profile?.age ?? "—"}
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
              <Text style={styles.statEmoji}>💰</Text>
              <Text style={[styles.statLabel, { color: themedColors.textSecondary }]}>INCOME</Text>
              <Text style={[styles.statValue, { color: themedColors.textPrimary }]}>
                ${user?.profile?.monthlyIncome?.toLocaleString() ?? "—"}
              </Text>
            </View>
          </View>
        </View>

        {/* Primary Goal */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themedColors.textPrimary }]}>
            Primary Goal
          </Text>
          <View style={[styles.goalsContainer, { backgroundColor: themedColors.surface }]}>
              {/* Emergency Fund */}
              <TouchableOpacity
                style={[
                    styles.goalOption,
                    { backgroundColor: themedColors.surface, borderColor: themedColors.border },
                    selectedGoal === 'save_emergency' && styles.goalOptionSelected
                ]}
                onPress={() => handleGoalChange('save_emergency')}
              >
                  <View style={[styles.goalIcon, { backgroundColor: `${colors.primary}33` }]}>
                      <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
                  </View>
                  <View style={styles.goalContent}>
                      <Text style={[styles.goalTitle, { color: themedColors.textPrimary }]}>Emergency Fund</Text>
                      <Text style={[styles.goalDescription, { color: themedColors.textSecondary }]}>Build 3-6 months safety net</Text>
                  </View>
                  {selectedGoal === 'save_emergency' && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
              </TouchableOpacity>

              {/* Pay Debt */}
              <TouchableOpacity
                style={[
                    styles.goalOption,
                    { backgroundColor: themedColors.surface, borderColor: themedColors.border },
                    selectedGoal === 'pay_debt' && styles.goalOptionSelected
                ]}
                onPress={() => handleGoalChange('pay_debt')}
              >
                  <View style={[styles.goalIcon, { backgroundColor: `${colors.error}33` }]}>
                      <Ionicons name="trending-down" size={24} color={colors.error} />
                  </View>
                  <View style={styles.goalContent}>
                      <Text style={[styles.goalTitle, { color: themedColors.textPrimary }]}>Pay Off Debt</Text>
                      <Text style={[styles.goalDescription, { color: themedColors.textSecondary }]}>Focus on high-interest loans</Text>
                  </View>
                   {selectedGoal === 'pay_debt' && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
              </TouchableOpacity>
              
              {/* Invest */}
              <TouchableOpacity
                style={[
                    styles.goalOption,
                    { backgroundColor: themedColors.surface, borderColor: themedColors.border },
                    selectedGoal === 'invest' && styles.goalOptionSelected
                ]}
                onPress={() => handleGoalChange('invest')}
              >
                  <View style={[styles.goalIcon, { backgroundColor: `${colors.success}33` }]}>
                      <Ionicons name="trending-up" size={24} color={colors.success} />
                  </View>
                  <View style={styles.goalContent}>
                      <Text style={[styles.goalTitle, { color: themedColors.textPrimary }]}>Invest Wealth</Text>
                      <Text style={[styles.goalDescription, { color: themedColors.textSecondary }]}>Grow net worth over time</Text>
                  </View>
                   {selectedGoal === 'invest' && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
              </TouchableOpacity>
              
               {/* Budget Control */}
              <TouchableOpacity
                style={[
                    styles.goalOption,
                    { backgroundColor: themedColors.surface, borderColor: themedColors.border },
                    selectedGoal === 'budget_control' && styles.goalOptionSelected
                ]}
                onPress={() => handleGoalChange('budget_control')}
              >
                  <View style={[styles.goalIcon, { backgroundColor: `${colors.accent}33` }]}>
                      <Ionicons name="wallet" size={24} color={colors.accent} />
                  </View>
                  <View style={styles.goalContent}>
                      <Text style={[styles.goalTitle, { color: themedColors.textPrimary }]}>Budget Control</Text>
                      <Text style={[styles.goalDescription, { color: themedColors.textSecondary }]}>Stop living paycheck to paycheck</Text>
                  </View>
                   {selectedGoal === 'budget_control' && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
              </TouchableOpacity>
          </View>
        </View>

        {/* Risk Tolerance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themedColors.textPrimary }]}>
            Risk Tolerance
          </Text>
           <View style={{ flexDirection: 'row', gap: 12 }}>
               {['conservative', 'moderate', 'aggressive'].map((level) => (
                   <TouchableOpacity 
                    key={level}
                    style={[
                        styles.riskCard, 
                        { backgroundColor: themedColors.surface, borderColor: themedColors.border },
                        riskTolerance === level && { borderColor: colors.primary, borderWidth: 2 }
                    ]}
                    onPress={() => handleRiskChange(level as RiskTolerance)}
                   >
                       <Text style={{ fontSize: 24, marginBottom: 8 }}>
                           {level === 'conservative' ? '🛡️' : level === 'moderate' ? '⚖️' : '🚀'}
                       </Text>
                       <Text style={[styles.riskLabel, { color: themedColors.textPrimary }]}>
                           {level.charAt(0).toUpperCase() + level.slice(1)}
                       </Text>
                   </TouchableOpacity>
               ))}
           </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themedColors.textPrimary }]}>
            Spending Categories
          </Text>
          <View style={[styles.preferencesContainer, { backgroundColor: themedColors.surface }]}>
            {[
              { emoji: "🍔", label: "Food" },
              { emoji: "🚌", label: "Transport" },
              { emoji: "💊", label: "Health" },
              { emoji: "🛍️", label: "Shopping" },
              { emoji: "💡", label: "Bills" },
              { emoji: "🎮", label: "Fun" },
            ].map((pref) => (
              <TouchableOpacity
                key={pref.label}
                style={[
                  styles.preferenceChip,
                  {
                    backgroundColor: themedColors.surfaceLight,
                    borderColor: themedColors.border,
                  },
                  spendingCategories.includes(pref.label) && styles.preferenceChipActive,
                ]}
                onPress={() => toggleCategory(pref.label)}
              >
                <Text style={styles.preferenceEmoji}>{pref.emoji}</Text>
                <Text
                  style={[
                    styles.preferenceLabel,
                    { color: themedColors.textPrimary },
                    spendingCategories.includes(pref.label) && styles.preferenceLabelActive,
                  ]}
                >
                  {pref.label}
                </Text>
              </TouchableOpacity>
            ))}
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
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundDark,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
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
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: colors.backgroundDark,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
    fontFamily: typography.fontFamily.display,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.body,
  },
  section: {
    marginBottom: spacing["2xl"],
  },
  sectionHeader: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.sm,
    paddingLeft: 4,
    fontFamily: typography.fontFamily.display,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    ...shadows.sm,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "500",
    textTransform: "uppercase",
    fontFamily: typography.fontFamily.body,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
    fontFamily: typography.fontFamily.display,
  },
  goalsContainer: {
    gap: 12,
    padding: spacing.sm,
    borderRadius: radius.xl,
  },
  goalOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderRadius: radius.xl,
      borderWidth: 1,
      gap: spacing.md,
  },
  goalOptionSelected: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}1A`, // slightly highlighted
  },
  goalIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      alignItems: 'center',
      justifyContent: 'center',
  },
  goalContent: {
      flex: 1,
  },
  goalTitle: {
      fontSize: 16,
      fontWeight: '700',
      fontFamily: typography.fontFamily.display,
  },
  goalDescription: {
      fontSize: 12,
      fontFamily: typography.fontFamily.body,
  },
  riskCard: {
      flex: 1,
      alignItems: 'center',
      padding: spacing.md,
      borderRadius: radius.xl,
      borderWidth: 1,
  },
  riskLabel: {
      fontWeight: '700',
      fontSize: 14,
  },
  preferencesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: spacing.md,
    borderRadius: radius["2xl"],
  },
  preferenceChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    gap: 6,
  },
  preferenceChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  preferenceEmoji: {
    fontSize: 16,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: typography.fontFamily.body,
  },
  preferenceLabelActive: {
    color: "#FFFFFF",
  },
});

export default ProfileScreen;
