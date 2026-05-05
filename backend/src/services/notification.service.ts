import axios from "axios";
import { User } from "../models/User.model";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

export const sendPushNotification = async (
  pushToken: string,
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<void> => {
  await axios.post(EXPO_PUSH_URL, {
    to: pushToken,
    title,
    body,
    data,
    sound: "default",
  });
};

export const computeSpendingPct = (spent: number, budget: number): number => {
  if (budget === 0) return 0;
  return spent / budget;
};

export const shouldSend80Alert = (pct: number, lastAlert80: Date | null): boolean => {
  if (pct < 0.8 || pct >= 1.0) return false;
  if (!lastAlert80) return true;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return new Date(lastAlert80) < todayStart;
};

export const shouldSend100Alert = (pct: number, lastAlert100: Date | null): boolean => {
  if (pct < 1.0) return false;
  if (!lastAlert100) return true;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  return new Date(lastAlert100) < todayStart;
};

export const checkAndSendSpendingAlert = async (
  userId: string,
  totalSpent: number
): Promise<void> => {
  const user = await User.findById(userId);
  if (!user || !user.pushToken || !user.userPrefs?.spendingAlerts) return;

  const dailyBudget = user.profile.monthlyIncome > 0
    ? Math.round(user.profile.monthlyIncome / 30)
    : 100;

  const pct = computeSpendingPct(totalSpent, dailyBudget);
  const currencyCode = user.userPrefs?.currency ?? "USD";

  if (shouldSend100Alert(pct, user.notifiedToday?.alert100 ?? null)) {
    try {
      await sendPushNotification(
        user.pushToken,
        "🚨 Daily limit reached!",
        `You've spent ${currencyCode} ${totalSpent.toFixed(2)} today. The coach has tips — tap to see.`,
        { screen: "ChatHistory" }
      );
      await User.updateOne({ _id: userId }, { "notifiedToday.alert100": new Date() });
    } catch (err) {
      console.error("[NotificationService] Failed to send 100% alert:", err);
    }
  } else if (shouldSend80Alert(pct, user.notifiedToday?.alert80 ?? null)) {
    try {
      await sendPushNotification(
        user.pushToken,
        "⚠️ Heads up!",
        `You've used 80% of today's ${currencyCode} ${dailyBudget} budget.`
      );
      await User.updateOne({ _id: userId }, { "notifiedToday.alert80": new Date() });
    } catch (err) {
      console.error("[NotificationService] Failed to send 80% alert:", err);
    }
  }
};
