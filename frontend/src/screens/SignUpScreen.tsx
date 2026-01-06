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
import { colors, spacing, useThemedColors } from "../theme";
import { useAuthStore } from "../stores/authStore";
import { useUserStore } from "../stores/userStore";
import { ScreenContainer } from "../components/common/ScreenContainer";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { SocialButton } from "../components/common/SocialButton";
import { Ionicons } from "@expo/vector-icons";
import * as authApi from "../api/auth";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "SignUp">;

const SignUpScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const themedColors = useThemedColors();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        profile: {},
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
              Join us to start your personalized nutrition journey today.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Your name</Text>
            <Input
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              containerStyle={styles.inputContainer}
            />

            <Text style={styles.label}>Your email</Text>
            <Input
              placeholder="Your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              containerStyle={styles.inputContainer}
            />

            <Text style={styles.label}>Create a password</Text>
            <Input
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              containerStyle={styles.inputContainer}
            />

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
    color: colors.textSecondaryLight,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  infoText: {
    fontFamily: "RobotoMono-Regular",
    fontSize: 12,
    color: colors.textSecondaryLight,
    marginBottom: spacing.lg,
    lineHeight: 18,
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
    fontFamily: "RobotoMono-Regular",
    marginHorizontal: spacing.md,
    color: colors.textSecondaryLight,
    fontSize: 12,
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
    fontFamily: "RobotoMono-Regular",
    fontSize: 13,
    color: colors.textSecondaryLight,
    textAlign: "center",
  },
  linkText: {
    fontFamily: "RobotoMono-Bold",
    fontSize: 13,
    color: colors.primary,
    textDecorationLine: "underline",
  },
});

export default SignUpScreen;
