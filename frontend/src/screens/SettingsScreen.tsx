/**
 * Settings Screen
 * User preferences, notifications, and account management
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../components/common/ScreenContainer";
import {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  useThemedColors,
} from "../theme";
import { useAuthStore } from "../stores/authStore";
import { useUserStore } from "../stores/userStore";
import { useThemeStore } from "../stores/themeStore";
import * as authApi from "../api/auth";

const SettingsScreen = () => {
  const { clearTokens } = useAuthStore();
  const { clearUser } = useUserStore();
  const { themeMode, isDark, setThemeMode } = useThemeStore();
  const themedColors = useThemedColors();
  const [useMetric, setUseMetric] = useState(true);
  const [mealReminders, setMealReminders] = useState(true);
  const [hydrationAlerts, setHydrationAlerts] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await authApi.logout();
            await clearTokens();
            clearUser();
          } catch (error) {
            console.error("Logout error:", error);
          }
        },
      },
    ]);
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
        <Text style={[styles.title, { color: themedColors.textPrimary }]}>
          Settings
        </Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <View
            style={[
              styles.profileCard,
              { backgroundColor: themedColors.surface },
            ]}
          >
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: "https://via.placeholder.com/64" }}
                style={styles.avatar}
              />
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.profileNameRow}>
                <Text
                  style={[
                    styles.profileName,
                    { color: themedColors.textPrimary },
                  ]}
                >
                  Alex Green
                </Text>
                <View style={styles.proBadge}>
                  <Text style={styles.proText}>PRO</Text>
                  <Text style={styles.proStar}>⭐️</Text>
                </View>
              </View>
              <Text
                style={[
                  styles.profileEmail,
                  { color: themedColors.textSecondary },
                ]}
              >
                alex.green@example.com
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Ionicons
                name="create-outline"
                size={24}
                color={themedColors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Preferences */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionLabel, { color: themedColors.textSecondary }]}
          >
            APP PREFERENCES
          </Text>
          <View
            style={[
              styles.settingsGroup,
              { backgroundColor: themedColors.surface },
            ]}
          >
            {/* Units Preference */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingEmoji}>📏</Text>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: themedColors.textPrimary },
                  ]}
                >
                  Units
                </Text>
              </View>
              <View
                style={[
                  styles.segmentedControl,
                  { backgroundColor: themedColors.surfaceLight },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    useMetric && styles.segmentButtonActive,
                    useMetric && {
                      backgroundColor: themedColors.isDark
                        ? colors.backgroundDark
                        : colors.primary,
                    },
                  ]}
                  onPress={() => setUseMetric(true)}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      { color: themedColors.textSecondary },
                      useMetric && {
                        color: themedColors.isDark ? colors.primary : "#FFFFFF",
                      },
                    ]}
                  >
                    Metric (kg)
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.segmentButton,
                    !useMetric && styles.segmentButtonActive,
                    !useMetric && {
                      backgroundColor: themedColors.isDark
                        ? colors.backgroundDark
                        : colors.primary,
                    },
                  ]}
                  onPress={() => setUseMetric(false)}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      { color: themedColors.textSecondary },
                      !useMetric && {
                        color: themedColors.isDark ? colors.primary : "#FFFFFF",
                      },
                    ]}
                  >
                    Imperial (lbs)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={[styles.divider, { backgroundColor: themedColors.border }]}
            />

            {/* Dark Mode */}
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => setThemeMode(isDark ? "light" : "dark")}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingEmoji}>🌙</Text>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: themedColors.textPrimary },
                  ]}
                >
                  Dark Mode
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={(value) =>
                  setThemeMode(value ? "dark" : "light")
                }
                trackColor={{
                  false: isDark ? colors.gray[600] : colors.gray[500],
                  true: colors.primary,
                }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={
                  isDark ? colors.gray[600] : colors.gray[500]
                }
              />
            </TouchableOpacity>

            <View
              style={[styles.divider, { backgroundColor: themedColors.border }]}
            />

            {/* Language */}
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingEmoji}>🗣️</Text>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: themedColors.textPrimary },
                  ]}
                >
                  Language
                </Text>
              </View>
              <View style={styles.settingRight}>
                <Text
                  style={[
                    styles.settingValue,
                    { color: themedColors.textSecondary },
                  ]}
                >
                  English (US)
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={themedColors.textSecondary}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionLabel, { color: themedColors.textSecondary }]}
          >
            NOTIFICATIONS
          </Text>
          <View
            style={[
              styles.settingsGroup,
              { backgroundColor: themedColors.surface },
            ]}
          >
            {/* Meal Reminders */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingEmoji}>🔔</Text>
                <View>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: themedColors.textPrimary },
                    ]}
                  >
                    Meal Reminders
                  </Text>
                  <Text
                    style={[
                      styles.settingSubtitle,
                      { color: themedColors.textSecondary },
                    ]}
                  >
                    Get nudged at breakfast, lunch, & dinner
                  </Text>
                </View>
              </View>
              <Switch
                value={mealReminders}
                onValueChange={setMealReminders}
                trackColor={{
                  false: isDark ? colors.gray[600] : colors.gray[500],
                  true: colors.primary,
                }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={
                  isDark ? colors.gray[600] : colors.gray[500]
                }
              />
            </View>

            <View
              style={[styles.divider, { backgroundColor: themedColors.border }]}
            />

            {/* Hydration Alerts */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingEmoji}>💧</Text>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: themedColors.textPrimary },
                  ]}
                >
                  Hydration Alerts
                </Text>
              </View>
              <Switch
                value={hydrationAlerts}
                onValueChange={setHydrationAlerts}
                trackColor={{
                  false: isDark ? colors.gray[600] : colors.gray[500],
                  true: colors.primary,
                }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={
                  isDark ? colors.gray[600] : colors.gray[500]
                }
              />
            </View>

            <View
              style={[styles.divider, { backgroundColor: themedColors.border }]}
            />

            {/* Weekly Digest */}
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingEmoji}>📰</Text>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: themedColors.textPrimary },
                  ]}
                >
                  Weekly Digest
                </Text>
              </View>
              <Switch
                value={weeklyDigest}
                onValueChange={setWeeklyDigest}
                trackColor={{
                  false: isDark ? colors.gray[600] : colors.gray[500],
                  true: colors.primary,
                }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={
                  isDark ? colors.gray[600] : colors.gray[500]
                }
              />
            </View>
          </View>
        </View>

        {/* Privacy & Account */}
        <View style={styles.section}>
          <Text
            style={[styles.sectionLabel, { color: themedColors.textSecondary }]}
          >
            PRIVACY & ACCOUNT
          </Text>
          <View
            style={[
              styles.settingsGroup,
              { backgroundColor: themedColors.surface },
            ]}
          >
            {/* Privacy Policy */}
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingEmoji}>🔒</Text>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: themedColors.textPrimary },
                  ]}
                >
                  Privacy Policy
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={themedColors.textSecondary}
              />
            </TouchableOpacity>

            <View
              style={[styles.divider, { backgroundColor: themedColors.border }]}
            />

            {/* Export Data */}
            <TouchableOpacity style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingEmoji}>💾</Text>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: themedColors.textPrimary },
                  ]}
                >
                  Export My Data
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={themedColors.textSecondary}
              />
            </TouchableOpacity>

            <View
              style={[styles.divider, { backgroundColor: themedColors.border }]}
            />

            {/* Log Out */}
            <TouchableOpacity
              style={[styles.settingRow, styles.logoutRow]}
              onPress={handleLogout}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingEmoji}>🚪</Text>
                <Text style={styles.logoutText}>Log Out</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View
            style={[styles.appIcon, { backgroundColor: themedColors.surface }]}
          >
            <Ionicons name="leaf" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.versionText}>AI Diet Consultant v1.0.2</Text>
        </View>

        <View style={{ height: 40 }} />
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
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimaryDark,
    fontFamily: typography.fontFamily.display,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.screenPadding,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondaryDark,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    paddingLeft: 4,
    fontFamily: typography.fontFamily.display,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surfaceDark,
    padding: spacing.md,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    ...shadows.sm,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.surfaceDark,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profileNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimaryDark,
    fontFamily: typography.fontFamily.display,
  },
  proBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 183, 77, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  proText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFB74D",
    fontFamily: typography.fontFamily.display,
  },
  proStar: {
    fontSize: 10,
    fontFamily: typography.fontFamily.body,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondaryDark,
    marginTop: 2,
    fontFamily: typography.fontFamily.body,
  },
  editButton: {
    padding: 8,
  },
  settingsGroup: {
    backgroundColor: colors.surfaceDark,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
    ...shadows.sm,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    minHeight: 60,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingEmoji: {
    fontSize: 24,
    width: 32,
    fontFamily: typography.fontFamily.body,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimaryDark,
    fontFamily: typography.fontFamily.body,
  },
  settingSubtitle: {
    fontSize: 12,
    color: colors.textSecondaryDark,
    marginTop: 2,
    fontFamily: typography.fontFamily.body,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondaryDark,
    fontFamily: typography.fontFamily.body,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginLeft: spacing.md,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: colors.surfaceDarkLight,
    borderRadius: radius.lg,
    padding: 4,
    gap: 4,
  },
  segmentButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 86,
    alignItems: "center",
  },
  segmentButtonActive: {
    backgroundColor: colors.backgroundDark,
    ...shadows.sm,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondaryDark,
    fontFamily: typography.fontFamily.display,
  },
  segmentTextActive: {
    color: colors.primary,
  },
  logoutRow: {
    backgroundColor: "transparent",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#EF4444",
    fontFamily: typography.fontFamily.body,
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: spacing["2xl"],
    paddingBottom: spacing.screenPadding,
  },
  appIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.lg,
  },
  versionText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.3)",
    fontWeight: "500",
    fontFamily: typography.fontFamily.body,
  },
});

export default SettingsScreen;
