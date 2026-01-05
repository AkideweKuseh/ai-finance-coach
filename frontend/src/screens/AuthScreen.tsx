/**
 * Authentication Screen (Placeholder)
 *
 * NOTE: This is a minimal implementation.
 * Full implementation should match the UI designs exactly.
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { colors, spacing, typography } from "../theme";
import { useAuthStore } from "../stores/authStore";
import { useUserStore } from "../stores/userStore";
import * as authApi from "../api/auth";

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setTokens } = useAuthStore();
  const { setUser } = useUserStore();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const response = await authApi.login({ email, password });
        await setTokens(response.accessToken, response.refreshToken);
        setUser(response.user);
      } else {
        // For registration, you'd need to collect more data
        Alert.alert("Info", "Registration flow needs full profile data");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Diet Consultant</Text>
      <Text style={styles.subtitle}>{isLogin ? "Login" : "Register"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.gray[500]}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.gray[500]}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleAuth}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : isLogin ? "Login" : "Register"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    padding: spacing.screenPadding,
    justifyContent: "center",
  },
  title: {
    fontSize: typography.fontSize["4xl"],
    fontWeight: typography.fontWeight.extrabold,
    color: colors.primary,
    textAlign: "center",
    marginBottom: spacing.sm,
    fontFamily: typography.fontFamily.display,
  },
  subtitle: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimaryDark,
    textAlign: "center",
    marginBottom: spacing["3xl"],
    fontFamily: typography.fontFamily.display,
  },
  input: {
    width: "100%",
    backgroundColor: colors.surfaceDark,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    color: colors.textPrimaryDark,
    fontSize: typography.fontSize.md,
    fontFamily: typography.fontFamily.body,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  buttonText: {
    color: "white",
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    fontFamily: typography.fontFamily.display,
  },
  switchText: {
    color: colors.primary,
    textAlign: "center",
    marginTop: spacing.xl,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.body,
  },
});

export default AuthScreen;
