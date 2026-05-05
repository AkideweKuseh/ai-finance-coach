import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors, spacing, useThemedColors } from "../theme";
import { useUserStore } from "../stores/userStore";
import { useAlertStore } from "../stores/alertStore";
import * as userApi from "../api/user";
import { CurrencyPicker } from "../components/common/CurrencyPicker";
import {
  getCurrencySymbol,
  generateProjectionData,
  getGoalTimelineLabel,
} from "../utils/currency";
import { LineChart } from "react-native-chart-kit";

const SCREEN_WIDTH = Dimensions.get("window").width;
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type FinancialGoal = "save_emergency" | "pay_debt" | "invest" | "budget_control";
type RiskTolerance = "conservative" | "moderate" | "aggressive";

interface Answers {
  currency: string;
  income: number;
  savings: number;
  age: number;
  goal: FinancialGoal;
  risk: RiskTolerance;
  categories: string[];
}

interface ChatMessage {
  id: string;
  text: string;
  isCoach: boolean;
}

const GOAL_OPTIONS = [
  { value: "save_emergency" as FinancialGoal, label: "Emergency Fund", icon: "shield-checkmark" as const },
  { value: "pay_debt" as FinancialGoal, label: "Pay Off Debt", icon: "trending-down" as const },
  { value: "invest" as FinancialGoal, label: "Invest Wealth", icon: "trending-up" as const },
  { value: "budget_control" as FinancialGoal, label: "Budget Control", icon: "wallet" as const },
];

const RISK_OPTIONS = [
  { value: "conservative" as RiskTolerance, label: "Conservative", emoji: "🛡️" },
  { value: "moderate" as RiskTolerance, label: "Moderate", emoji: "⚖️" },
  { value: "aggressive" as RiskTolerance, label: "Aggressive", emoji: "🚀" },
];

const CATEGORY_OPTIONS = ["Food", "Transport", "Health", "Shopping", "Bills", "Fun"];

const GOAL_NAMES: Record<FinancialGoal, string> = {
  save_emergency: "Emergency Fund",
  pay_debt: "Debt Freedom",
  invest: "Wealth Building",
  budget_control: "Budget Mastery",
};

const OnboardingScreen = () => {
  const themedColors = useThemedColors();
  const navigation = useNavigation<any>();
  const { user, setUser } = useUserStore();
  const { showAlert } = useAlertStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState<Partial<Answers>>({});
  const [inputValue, setInputValue] = useState("");
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  const addMessage = (text: string, isCoach: boolean) => {
    const id = `msg-${Date.now()}-${Math.random()}`;
    setMessages((prev) => [...prev, { id, text, isCoach }]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
  };

  const getStepPrompt = (step: number, ans: Partial<Answers>): string => {
    const symbol = getCurrencySymbol(ans.currency ?? "USD");
    switch (step) {
      case 0: return `Hi ${user?.name?.split(" ")[0] ?? "there"}! I'm your AI Finance Coach. Let's set up your profile. First — what currency do you use?`;
      case 1: return `Great choice! What's your monthly income? (${symbol})`;
      case 2: return `How much do you want to save each month? (${symbol})`;
      case 3: return "How old are you?";
      case 4: return "What's your main financial goal right now?";
      case 5: return "How do you feel about financial risk?";
      case 6: return "Which categories do you usually spend on? (select all that apply)";
      default: return "";
    }
  };

  // Show first message on mount
  useEffect(() => {
    setTimeout(() => {
      addMessage(getStepPrompt(0, {}), true);
      setCurrentStep(0);
    }, 400);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const advanceToStep = (newAnswers: Partial<Answers>, userText: string, nextStep: number) => {
    addMessage(userText, false);
    setTimeout(() => {
      if (nextStep <= 6) {
        addMessage(getStepPrompt(nextStep, newAnswers), true);
        setCurrentStep(nextStep);
        setInputValue("");
      } else {
        addMessage("Here's your personalised financial snapshot 👇", true);
        setTimeout(() => setShowAnalysis(true), 600);
        setCurrentStep(7);
      }
    }, 600);
  };

  const handleNumberInput = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || val < 0) {
      showAlert("Invalid", "Please enter a valid number.");
      return;
    }
    if (currentStep === 3 && (val < 13 || val > 120)) {
      showAlert("Invalid", "Please enter an age between 13 and 120.");
      return;
    }
    const key = currentStep === 1 ? "income" : currentStep === 2 ? "savings" : "age";
    const newAnswers = { ...answers, [key]: currentStep === 3 ? Math.round(val) : val };
    setAnswers(newAnswers);
    advanceToStep(newAnswers, inputValue, currentStep + 1);
  };

  const handleCurrencySelect = (code: string) => {
    const newAnswers = { ...answers, currency: code };
    setAnswers(newAnswers);
    advanceToStep(newAnswers, code, 1);
  };

  const handleGoalSelect = (goal: FinancialGoal, label: string) => {
    const newAnswers = { ...answers, goal };
    setAnswers(newAnswers);
    advanceToStep(newAnswers, label, 5);
  };

  const handleRiskSelect = (risk: RiskTolerance, label: string) => {
    const newAnswers = { ...answers, risk };
    setAnswers(newAnswers);
    advanceToStep(newAnswers, label, 6);
  };

  const handleCategoryToggle = (cat: string) => {
    const current = answers.categories ?? [];
    const next = current.includes(cat)
      ? current.filter((c) => c !== cat)
      : [...current, cat];
    setAnswers((prev) => ({ ...prev, categories: next }));
  };

  const handleCategoriesDone = () => {
    const cats = answers.categories ?? [];
    if (cats.length === 0) {
      showAlert("Select at least one", "Pick at least one spending category.");
      return;
    }
    const newAnswers = { ...answers, categories: cats };
    setAnswers(newAnswers);
    advanceToStep(newAnswers, cats.join(", "), 7);
  };

  const handleComplete = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const a = answers as Answers;
      const updated = await userApi.updateProfile({
        profile: {
          monthlyIncome: a.income,
          age: a.age,
          primaryGoal: a.goal,
          riskTolerance: a.risk,
          spendingCategories: a.categories,
          monthlySavingsTarget: a.savings,
        },
        userPrefs: { currency: a.currency },
        hasCompletedOnboarding: true,
      } as any);
      setUser(updated);
      navigation.reset({ index: 0, routes: [{ name: "Main" }] });
    } catch {
      showAlert("Error", "Failed to save your profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderInput = () => {
    if (currentStep === 0) {
      return (
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={() => setShowCurrencyPicker(true)}
        >
          <Text style={styles.primaryBtnText}>Choose Currency</Text>
        </TouchableOpacity>
      );
    }
    if (currentStep >= 1 && currentStep <= 3) {
      return (
        <View style={styles.inputRow}>
          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            keyboardType="numeric"
            placeholder={currentStep === 3 ? "Your age" : "Enter amount"}
            placeholderTextColor={themedColors.textSecondary}
            style={[styles.textInput, {
              color: themedColors.textPrimary,
              borderColor: colors.primary,
              backgroundColor: themedColors.surface,
            }]}
            returnKeyType="done"
            onSubmitEditing={handleNumberInput}
            autoFocus
          />
          <TouchableOpacity
            style={[styles.sendBtn, { backgroundColor: colors.primary }]}
            onPress={handleNumberInput}
          >
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      );
    }
    if (currentStep === 4) {
      return (
        <View style={styles.chipsGrid}>
          {GOAL_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, { backgroundColor: themedColors.surface, borderColor: themedColors.border }]}
              onPress={() => handleGoalSelect(opt.value, opt.label)}
            >
              <Ionicons name={opt.icon} size={18} color={colors.primary} />
              <Text style={[styles.chipText, { color: themedColors.textPrimary }]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    if (currentStep === 5) {
      return (
        <View style={styles.chipsRow}>
          {RISK_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, { backgroundColor: themedColors.surface, borderColor: themedColors.border, flex: 1 }]}
              onPress={() => handleRiskSelect(opt.value, opt.label)}
            >
              <Text style={{ fontSize: 22 }}>{opt.emoji}</Text>
              <Text style={[styles.chipText, { color: themedColors.textPrimary }]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    if (currentStep === 6) {
      const selected = answers.categories ?? [];
      return (
        <View>
          <View style={styles.chipsWrap}>
            {CATEGORY_OPTIONS.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chip,
                  { backgroundColor: themedColors.surface, borderColor: themedColors.border },
                  selected.includes(cat) && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => handleCategoryToggle(cat)}
              >
                <Text style={[
                  styles.chipText,
                  { color: selected.includes(cat) ? "#fff" : themedColors.textPrimary },
                ]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 12 }]}
            onPress={handleCategoriesDone}
          >
            <Text style={styles.primaryBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const renderAnalysisCard = () => {
    if (!showAnalysis) return null;
    const a = answers as Answers;
    const symbol = getCurrencySymbol(a.currency);
    const projData = generateProjectionData(a.savings);
    const dailyBudget = Math.round(a.income / 30);
    const timeline = getGoalTimelineLabel(a.goal, a.income, a.savings);
    const riskLabel = a.risk.charAt(0).toUpperCase() + a.risk.slice(1);
    const annualSavings = a.savings * 12;
    const coachMsg = `Based on your income, you can save ${symbol}${annualSavings.toLocaleString()} this year toward your ${GOAL_NAMES[a.goal]} goal. ${timeline.startsWith("~") ? `At this rate you'll reach it in ${timeline} — let's make it happen!` : `Your coach will help you map the path — let's get started!`}`;

    return (
      <View style={[styles.analysisCard, { backgroundColor: themedColors.surface }]}>
        <Text style={[styles.analysisTitle, { color: themedColors.textPrimary }]}>
          Your 12-Month Savings Projection
        </Text>
        <LineChart
          data={{ labels: MONTH_LABELS, datasets: [{ data: projData }] }}
          width={SCREEN_WIDTH - 80}
          height={160}
          chartConfig={{
            backgroundGradientFrom: themedColors.surface,
            backgroundGradientTo: themedColors.surface,
            decimalPlaces: 0,
            color: () => colors.primary,
            labelColor: () => themedColors.textSecondary,
            propsForDots: { r: "3", strokeWidth: "2", stroke: colors.primary },
          }}
          bezier
          style={{ borderRadius: 12, marginVertical: 8 }}
        />
        <View style={styles.statRow}>
          {[
            { emoji: "💰", label: "Daily Budget", value: `${symbol}${dailyBudget}` },
            { emoji: "🎯", label: "Goal Timeline", value: timeline },
            { emoji: "📊", label: "Risk Profile", value: riskLabel },
          ].map((stat) => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: themedColors.background }]}>
              <Text style={{ fontSize: 20 }}>{stat.emoji}</Text>
              <Text style={[styles.statLabel, { color: themedColors.textSecondary }]}>{stat.label}</Text>
              <Text style={[styles.statValue, { color: themedColors.textPrimary }]}>{stat.value}</Text>
            </View>
          ))}
        </View>
        <Text style={[styles.coachMsg, { color: themedColors.textSecondary }]}>{coachMsg}</Text>
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: colors.primary, marginTop: 16 }]}
          onPress={handleComplete}
          disabled={isSaving}
        >
          {isSaving
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.primaryBtnText}>Let's Start 🚀</Text>
          }
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: themedColors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={20}
    >
      <View style={[styles.header, { borderBottomColor: themedColors.border }]}>
        <View style={[styles.avatarDot, { backgroundColor: colors.primary }]}>
          <Ionicons name="sparkles" size={18} color="#fff" />
        </View>
        <Text style={[styles.headerTitle, { color: themedColors.textPrimary }]}>AI Finance Coach</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.bubbleRow, msg.isCoach ? styles.coachRow : styles.userRow]}>
            {msg.isCoach && (
              <View style={[styles.miniAvatar, { backgroundColor: colors.primary }]}>
                <Ionicons name="sparkles" size={10} color="#fff" />
              </View>
            )}
            <View style={[
              styles.bubble,
              msg.isCoach
                ? [styles.coachBubble, { backgroundColor: themedColors.surface }]
                : [styles.userBubble, { backgroundColor: colors.primary }],
            ]}>
              <Text style={[
                styles.bubbleText,
                { color: msg.isCoach ? themedColors.textPrimary : "#fff" },
              ]}>
                {msg.text}
              </Text>
            </View>
          </View>
        ))}

        {showAnalysis && renderAnalysisCard()}
        <View style={{ height: 20 }} />
      </ScrollView>

      {currentStep >= 0 && currentStep <= 6 && (
        <View style={[styles.inputArea, {
          borderTopColor: themedColors.border,
          backgroundColor: themedColors.background,
        }]}>
          {renderInput()}
        </View>
      )}

      <CurrencyPicker
        visible={showCurrencyPicker}
        selectedCode={answers.currency ?? "USD"}
        onSelect={handleCurrencySelect}
        onClose={() => setShowCurrencyPicker(false)}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", padding: 16, borderBottomWidth: 1, gap: 10 },
  avatarDot: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700", fontFamily: "RobotoMono-Bold" },
  scrollContent: { padding: 16, paddingBottom: 8 },
  bubbleRow: { flexDirection: "row", marginBottom: 12, gap: 8 },
  coachRow: { alignItems: "flex-end" },
  userRow: { flexDirection: "row-reverse" },
  miniAvatar: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 4 },
  bubble: { maxWidth: "80%", padding: 12, borderRadius: 16 },
  coachBubble: { borderTopLeftRadius: 4 },
  userBubble: { borderTopRightRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 20, fontFamily: "RobotoMono-Regular" },
  inputArea: { padding: 16, borderTopWidth: 1 },
  inputRow: { flexDirection: "row", gap: 8 },
  textInput: { flex: 1, borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, fontFamily: "RobotoMono-Regular" },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  primaryBtn: { borderRadius: 30, paddingVertical: 14, alignItems: "center" },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 16, fontFamily: "RobotoMono-Bold" },
  chipsGrid: { gap: 8 },
  chipsRow: { flexDirection: "row", gap: 8 },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { borderWidth: 1.5, borderRadius: 12, padding: 12, alignItems: "center", gap: 6 },
  chipText: { fontSize: 13, fontWeight: "600", fontFamily: "RobotoMono-Bold" },
  analysisCard: { borderRadius: 20, padding: 16, marginTop: 8 },
  analysisTitle: { fontSize: 16, fontWeight: "700", fontFamily: "RobotoMono-Bold", marginBottom: 4 },
  statRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  statCard: { flex: 1, borderRadius: 12, padding: 10, alignItems: "center", gap: 4 },
  statLabel: { fontSize: 9, fontWeight: "600", textTransform: "uppercase", fontFamily: "RobotoMono-Regular" },
  statValue: { fontSize: 13, fontWeight: "700", textAlign: "center", fontFamily: "RobotoMono-Bold" },
  coachMsg: { fontSize: 13, lineHeight: 20, marginTop: 12, fontFamily: "RobotoMono-Regular" },
});

export default OnboardingScreen;
