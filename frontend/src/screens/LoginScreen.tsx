import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { colors, spacing, useThemedColors } from "../theme";
import { useAuthStore } from "../stores/authStore";
import { useUserStore } from "../stores/userStore";
import { ScreenContainer } from "../components/common/ScreenContainer";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { SocialButton } from "../components/common/SocialButton";
import { Ionicons } from "@expo/vector-icons";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const themedColors = useThemedColors();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setTokens } = useAuthStore();
  const { setUser } = useUserStore();

  const handleLogin = async () => {
    console.log("Login button pressed", { email, password });

    if (!email || !password) {
      console.log("Validation failed - missing email or password");
      return;
    }

    console.log("Starting login process...");
    setLoading(true);

    // Simulate API call
    setTimeout(async () => {
      console.log("Creating mock user...");
      const mockUser = {
        id: "1",
        email: email,
        name: "User",
        role: "user",
        profile: {
          age: 30,
          gender: "female",
          height: 165,
          weight: 60,
          activityLevel: "moderate",
          dietaryPreferences: [],
          healthGoals: [],
        },
      };

      console.log("Setting user and tokens...");
      setUser(mockUser as any);
      await setTokens("mock-access-token", "mock-refresh-token");
      setLoading(false);
      console.log("Login complete!");
      // Navigation will happen automatically via AppNavigator when isAuthenticated becomes true
    }, 1000);
  };

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
              color={themedColors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Log in</Text>
            <Text style={styles.subtitle}>
              By logging in, you agree to our{" "}
              <Text style={styles.link}>Terms of Use</Text>.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <Input
              placeholder="Your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              containerStyle={styles.inputContainer}
            />

            <Text style={styles.label}>Password</Text>
            <Input
              placeholder="Your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              containerStyle={styles.inputContainer}
            />

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              title="Connect"
              onPress={handleLogin}
              loading={loading}
              variant="primary"
              style={styles.loginButton}
            />

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.dividerLine} />
            </View>

            <SocialButton
              icon="logo-google"
              title="Sign in with google"
              iconColor="#DB4437"
              style={styles.socialButton}
            />

            <SocialButton
              icon="logo-facebook"
              title="Sign in with Facebook"
              iconColor="#4267B2"
              style={styles.socialButton}
            />
          </View>

          <Text style={styles.footerText}>
            For more information, please see our{" "}
            <Text style={styles.link}>Privacy policy</Text>.
          </Text>
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
    fontFamily: "RobotoMono-Bold",
    fontSize: 32,
    color: colors.textPrimaryLight,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontFamily: "RobotoMono-Regular",
    fontSize: 13,
    color: colors.textSecondaryLight,
    lineHeight: 20,
  },
  link: {
    fontFamily: "RobotoMono-Bold",
    color: colors.textPrimaryLight,
  },
  form: {
    marginBottom: spacing.xl,
  },
  label: {
    fontFamily: "RobotoMono-Medium",
    fontSize: 14,
    color: colors.textPrimaryLight,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    fontFamily: "RobotoMono-Medium",
    fontSize: 12,
    color: colors.primary,
  },
  loginButton: {
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
    fontFamily: "RobotoMono-Regular",
    marginHorizontal: spacing.md,
    color: colors.textSecondaryLight,
    fontSize: 12,
  },
  socialButton: {
    marginBottom: spacing.md,
  },
  footerText: {
    fontFamily: "RobotoMono-Regular",
    fontSize: 11,
    color: colors.textSecondaryLight,
    textAlign: "center",
    marginTop: "auto",
    paddingBottom: spacing.xl,
    lineHeight: 18,
  },
});

export default LoginScreen;
