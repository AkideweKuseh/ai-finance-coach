import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { colors, spacing, useThemedColors, typography, radius } from "../theme";
import { useAuthStore } from "../stores/authStore";
import { useUserStore } from "../stores/userStore";
import { ScreenContainer } from "../components/common/ScreenContainer";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { SocialButton } from "../components/common/SocialButton";
import { Ionicons } from "@expo/vector-icons";
import * as authApi from "../api/auth";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "SignUp">;
type FinancialGoal = "save_emergency" | "pay_debt" | "invest" | "budget_control";
type RiskTolerance = "conservative" | "moderate" | "aggressive";

const SignUpScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const themedColors = useThemedColors();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [income, setIncome] = useState("");
  const [goal, setGoal] = useState<FinancialGoal>("save_emergency");
  const [risk, setRisk] = useState<RiskTolerance>("moderate");
  const [loading, setLoading] = useState(false);

  const { setTokens } = useAuthStore();
  const { setUser } = useUserStore();

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert(
        "Missing info",
        "Please enter your name, email, and password."
      );
      return;
    }

    setLoading(true);

    try {
      const { user, accessToken, refreshToken } = await authApi.register({
        name,
        email,
        password,
        profile: {
            monthlyIncome: income ? parseFloat(income) : 0,
            primaryGoal: goal,
            riskTolerance: risk,
            currency: "USD",
            spendingCategories: []
        },
      });

      setUser(user);
      await setTokens(accessToken, refreshToken);
      // Navigation will happen automatically via AppNavigator when isAuthenticated becomes true
    } catch (error: any) {
      Alert.alert("Sign up failed", error?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderGoalOption = (g: FinancialGoal, label: string, icon: any) => (
      <TouchableOpacity 
        style={[
            styles.optionButton, 
            goal === g && styles.optionButtonSelected,
            { backgroundColor: themedColors.surface, borderColor: themedColors.border }
        ]}
        onPress={() => setGoal(g)}
      >
          <Text style={{ fontSize: 20 }}>{icon}</Text>
          <Text style={[styles.optionLabel, { color: themedColors.textPrimary }]}>{label}</Text>
      </TouchableOpacity>
  );

  return (
    <ScreenContainer backgroundColor={themedColors.background}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="chevron-back"
              size={28}
              color={colors.textPrimaryLight}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Start your journey to financial freedom.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Your Details</Text>
            <Input
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              containerStyle={styles.inputContainer}
            />
            <Input
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              containerStyle={styles.inputContainer}
            />
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              containerStyle={styles.inputContainer}
            />
            
            <Text style={styles.label}>Financial Profile</Text>
            <Input
              placeholder="Monthly Income (approx)"
              value={income}
              onChangeText={setIncome}
              keyboardType="numeric"
              containerStyle={styles.inputContainer}
            />
            
            <Text style={styles.subLabel}>Primary Goal</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                {renderGoalOption("save_emergency", "Safety Net", "🛡️")}
                {renderGoalOption("pay_debt", "Pay Debt", "📉")}
                {renderGoalOption("invest", "Invest", "📈")}
                {renderGoalOption("budget_control", "Budget", "👛")}
            </ScrollView>

            <Text style={styles.subLabel}>Risk Tolerance</Text>
            <View style={styles.riskContainer}>
                {(['conservative', 'moderate', 'aggressive'] as RiskTolerance[]).map(r => (
                    <TouchableOpacity
                        key={r}
                        style={[
                            styles.riskButton,
                            risk === r && { backgroundColor: colors.primary, borderColor: colors.primary },
                            { borderColor: themedColors.border }
                        ]}
                        onPress={() => setRisk(r)}
                    >
                        <Text style={[
                            styles.riskText, 
                            { color: risk === r ? '#fff' : themedColors.textSecondary }
                        ]}>
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.infoText}>
              By signing up, you agree to our{" "}
              <Text style={styles.link}>Terms of Use</Text> and{" "}
              <Text style={styles.link}>Privacy Policy</Text>.
            </Text>

            <Button
              title="Create Account"
              onPress={handleSignUp}
              loading={loading}
              variant="primary"
              style={styles.signupButton}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <SocialButton
                icon="logo-google"
                iconColor="#DB4437"
                style={styles.socialIconButton}
              />
              <SocialButton
                icon="logo-facebook"
                iconColor="#4267B2"
                style={styles.socialIconButton}
              />
              <SocialButton
                icon="logo-apple"
                iconColor="#000"
                style={styles.socialIconButton}
              />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Text
                style={styles.linkText}
                onPress={() => navigation.navigate("Login")}
              >
                Log in
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  titleContainer: {
    marginBottom: spacing["2xl"],
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimaryLight,
    marginBottom: spacing.sm,
    fontFamily: typography.fontFamily.display,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondaryLight,
    lineHeight: 20,
    fontFamily: typography.fontFamily.body,
  },
  link: {
    fontWeight: '700',
    color: colors.textPrimaryLight,
  },
  form: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondaryLight,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
    fontFamily: typography.fontFamily.body,
  },
  subLabel: {
      fontSize: 12,
      color: colors.textSecondaryLight,
      marginBottom: spacing.xs,
      marginTop: spacing.sm,
      fontFamily: typography.fontFamily.body,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  optionsScroll: {
      flexDirection: 'row',
      marginBottom: spacing.md,
  },
  optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.sm,
      borderRadius: radius.lg,
      borderWidth: 1,
      marginRight: spacing.sm,
      gap: 8,
  },
  optionButtonSelected: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}1A`,
  },
  optionLabel: {
      fontWeight: '600',
      fontSize: 12,
  },
  riskContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
      marginBottom: spacing.lg,
  },
  riskButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 10,
      borderRadius: radius.lg,
      borderWidth: 1,
  },
  riskText: {
      fontWeight: '600',
      fontSize: 12,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondaryLight,
    marginBottom: spacing.lg,
    lineHeight: 18,
    fontFamily: typography.fontFamily.body,
  },
  signupButton: {
    marginBottom: spacing.xl,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray[200],
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.textSecondaryLight,
    fontSize: 12,
    fontFamily: typography.fontFamily.body,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  socialIconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 0,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondaryLight,
    textAlign: "center",
    fontFamily: typography.fontFamily.body,
  },
  linkText: {
    fontWeight: '700',
    fontSize: 13,
    color: colors.primary,
    textDecorationLine: "underline",
    fontFamily: typography.fontFamily.body,
  },
});

export default SignUpScreen;
