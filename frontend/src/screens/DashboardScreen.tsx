/**
 * Dashboard Screen
 * Main home screen showing daily spending, budget, and transactions
 */

import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, MainTabScreenProps } from "../navigation/types";
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
import { useTransactionStore } from "../stores/transactionStore";
import * as userApi from "../api/user";

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
        color={isPrimary ? "#FFFFFF" : colors.accent}
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

const TransactionItem = ({ item, onPress }: { item: any; onPress: () => void }) => {
  const themedColors = useThemedColors();
  return (
    <TouchableOpacity
      style={[
        styles.transactionCard,
        {
          backgroundColor: themedColors.surface,
          borderColor: themedColors.border,
        },
      ]}
      onPress={onPress}
    >
        <View style={styles.transactionIcon}>
            <Ionicons name={getCategoryIcon(item.category)} size={24} color={colors.primary} />
        </View>
        <View style={styles.transactionContent}>
            <Text style={[styles.transactionTitle, { color: themedColors.textPrimary }]}>{item.description}</Text>
            <Text style={[styles.transactionMeta, { color: themedColors.textSecondary }]}>
                {item.category} • {item.mood || 'Neutral'}
            </Text>
        </View>
        <Text style={[styles.transactionAmount, { color: themedColors.textPrimary }]}>
            -${item.amount.toFixed(2)}
        </Text>
    </TouchableOpacity>
  );
};

const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
    switch(category.toLowerCase()) {
        case 'food': return 'restaurant';
        case 'transport': return 'car';
        case 'shopping': return 'cart';
        case 'bills': return 'receipt';
        case 'entertainment': return 'game-controller';
        default: return 'card';
    }
}

const DashboardScreen = () => {
  const themedColors = useThemedColors();
  const navigation = useNavigation<MainTabScreenProps<"Dashboard">["navigation"]>();
  const { user, spendingSummary, isLoading: isUserLoading } = useUserStore();
  const { transactions, fetchTransactions, isLoading: isTransLoading } = useTransactionStore();

  useEffect(() => {
    const load = async () => {
      fetchTransactions();
      try {
        const summary = await userApi.getSpendingSummary();
        useUserStore.getState().setSpendingSummary(summary);
      } catch {
        // silent — dashboard shows defaults
      }
    };
    load();
  }, []);

  const onRefresh = React.useCallback(async () => {
    fetchTransactions();
    try {
      const summary = await userApi.getSpendingSummary();
      useUserStore.getState().setSpendingSummary(summary);
    } catch {
      // silent
    }
  }, []);

  const firstName = user?.name?.split(" ")?.[0] || "Friend";

  const budgetLimit = spendingSummary?.budgetLimit || 100;
  const totalSpent = spendingSummary?.totalSpent || 0;
  // logic: percentage of budget used
  const progress = Math.min(
    100,
    Math.max(0, (totalSpent / Math.max(1, budgetLimit)) * 100)
  );
  
  const isOverBudget = totalSpent > budgetLimit;
  const progressColor = isOverBudget ? colors.error : colors.primary;

  // Calculate circle progress (circumference = 2πr, r=80)
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const recentTransactions = transactions.slice(0, 5);

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
            Hi, {firstName}! 💰
          </Text>
        </View>
        <TouchableOpacity
            style={[styles.avatar, { backgroundColor: themedColors.surface }]}
            onPress={() => navigation.navigate("Profile")}
        >
          <Ionicons name="person" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl refreshing={isUserLoading || isTransLoading} onRefresh={onRefresh} />
        }
      >
        {/* Hero Summary Card */}
        <View
          style={[styles.heroCard, { backgroundColor: themedColors.surface }]}
        >
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: themedColors.textPrimary }]}>Daily Budget</Text>
                <View style={[styles.statusBadge, { backgroundColor: isOverBudget ? `${colors.error}1A` : `${colors.primary}1A` }]}>
                    <Text style={[styles.statusText, { color: isOverBudget ? colors.error : colors.primary }]}>
                        {isOverBudget ? "Over Budget" : "On Track"}
                    </Text>
                </View>
            </View>

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
                stroke={progressColor}
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
                  styles.spentAmount,
                  { color: themedColors.textPrimary },
                ]}
              >
                ${totalSpent.toFixed(2)}
              </Text>
              <Text
                style={[
                  styles.budgetMeta,
                  { color: themedColors.textSecondary },
                ]}
              >
                of ${budgetLimit} limit
              </Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
              <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.warning }]}>{spendingSummary?.emotionalSpendingCount || 0}</Text>
                  <Text style={[styles.statLabel, { color: themedColors.textSecondary }]}>Emotional Buys</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: themedColors.textPrimary }]}>{spendingSummary?.topTrigger || 'None'}</Text>
                  <Text style={[styles.statLabel, { color: themedColors.textSecondary }]}>Top Trigger</Text>
              </View>
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
              icon="add"
              label="Log Spend"
              isPrimary
              onPress={() => navigation.navigate("LogTransaction")}
            />
            <QuickAction
                icon="chatbubbles"
                label="Coach"
                onPress={() => navigation.navigate("ChatHistory")}
            />
            <QuickAction icon="scan" label="Scan Receipt" onPress={() => navigation.navigate("ScanReceipt")} />
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={[styles.sectionTitle, { color: themedColors.textPrimary }]}
            >
              Recent Transactions
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("AllTransactions")}>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsContainer}>
            {recentTransactions.length === 0 ? (
                <Text style={{ color: themedColors.textSecondary, textAlign: 'center', padding: 20 }}>
                    No transactions today. Good job saving!
                </Text>
            ) : (
                recentTransactions.map((t) => (
                    <TransactionItem 
                        key={t._id} 
                        item={t} 
                        onPress={() => navigation.navigate("TransactionDetail", { transactionId: t._id })} 
                    />
                ))
            )}
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
    fontWeight: "500",
    marginBottom: 4,
    fontFamily: typography.fontFamily.body,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 28,
    fontFamily: typography.fontFamily.display,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    borderRadius: radius["3xl"],
    padding: spacing.screenPadding,
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
      fontSize: 18,
      fontWeight: '700',
      fontFamily: typography.fontFamily.display,
  },
  progressRingContainer: {
    alignItems: "center",
    marginBottom: spacing.md,
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
  spentAmount: {
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -1,
    fontFamily: typography.fontFamily.display,
  },
  budgetMeta: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
    fontFamily: typography.fontFamily.body,
  },
  statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginTop: spacing.sm,
  },
  statItem: {
      alignItems: 'center',
  },
  statValue: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 2,
  },
  statLabel: {
      fontSize: 12,
  },
  statDivider: {
      width: 1,
      height: 30,
      backgroundColor: 'rgba(255,255,255,0.1)',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: typography.fontFamily.display,
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
    fontFamily: typography.fontFamily.display,
  },
  actionLabelPrimary: {
    color: "#FFFFFF",
  },
  transactionsContainer: {
    gap: 12,
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: 16,
    borderRadius: radius["2xl"],
    borderWidth: 1,
    ...shadows.sm,
  },
  transactionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: `${colors.primary}1A`,
      alignItems: 'center',
      justifyContent: 'center',
  },
  transactionContent: {
    flex: 1,
    gap: 4,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: typography.fontFamily.display,
  },
  transactionMeta: {
    fontSize: 12,
  },
  transactionAmount: {
      fontSize: 16,
      fontWeight: '700',
      fontFamily: typography.fontFamily.display,
  }
});

export default DashboardScreen;
