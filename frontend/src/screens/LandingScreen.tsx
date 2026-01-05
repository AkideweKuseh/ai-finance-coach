import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/types";
import { colors, spacing, useThemedColors } from "../theme";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../components/common/ScreenContainer";
import { Button } from "../components/common/Button";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "Landing">;

const LandingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const themedColors = useThemedColors();

  return (
    <ScreenContainer
      backgroundColor={colors.primary}
      withKeyboardAvoidingView={false}
    >
      <View style={styles.container}>
        {/* Decorative elements */}
        <View style={styles.decorativeContainer}>
          <View style={[styles.cloud, styles.cloud1]} />
          <View style={[styles.cloud, styles.cloud2]} />
          <Ionicons
            name="add"
            size={24}
            color="rgba(255, 255, 255, 0.3)"
            style={styles.plus1}
          />
          <Ionicons
            name="add"
            size={16}
            color="rgba(255, 255, 255, 0.3)"
            style={styles.plus2}
          />
          <Ionicons
            name="add"
            size={20}
            color="rgba(255, 255, 255, 0.3)"
            style={styles.plus3}
          />
          <Ionicons
            name="add"
            size={14}
            color="rgba(255, 255, 255, 0.3)"
            style={styles.plus4}
          />
        </View>

        {/* Main illustration area */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationCircle}>
            <Ionicons name="nutrition" size={120} color="#FFFFFF" />
          </View>
          <Ionicons
            name="star"
            size={24}
            color="#FFFFFF"
            style={styles.star1}
          />
          <Ionicons
            name="star"
            size={18}
            color="#FFFFFF"
            style={styles.star2}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              AI-powered nutrition{"\n"}for a healthier you.
            </Text>
            <Text style={styles.subtitle}>
              Personalized meal plans and expert{"\n"}guidance for your wellness
              journey.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Log in"
              variant="secondary"
              onPress={() => navigation.navigate("Login")}
            />

            <Button
              title="Create an account"
              variant="outline"
              onPress={() => navigation.navigate("SignUp")}
            />
          </View>

          <Text style={styles.brandName}>AI Diet Consultant</Text>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decorativeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  cloud: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 100,
  },
  cloud1: {
    width: 120,
    height: 60,
    top: 40,
    left: 30,
  },
  cloud2: {
    width: 100,
    height: 50,
    top: 60,
    right: 40,
  },
  plus1: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  plus2: {
    position: "absolute",
    top: 100,
    right: 30,
  },
  plus3: {
    position: "absolute",
    top: 140,
    left: "50%",
  },
  plus4: {
    position: "absolute",
    top: 80,
    right: "25%",
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginTop: 80,
  },
  illustrationCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  star1: {
    position: "absolute",
    top: "25%",
    right: "20%",
  },
  star2: {
    position: "absolute",
    bottom: "35%",
    left: "15%",
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  textContainer: {
    marginBottom: spacing["2xl"],
  },
  title: {
    fontFamily: "RobotoMono-Bold",
    fontSize: 28,
    color: "#FFFFFF",
    textAlign: "left",
    marginBottom: spacing.md,
    lineHeight: 36,
  },
  subtitle: {
    fontFamily: "RobotoMono-Regular",
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "left",
    lineHeight: 22,
  },
  buttonContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  brandName: {
    fontFamily: "RobotoMono-Bold",
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: spacing.md,
  },
});

export default LandingScreen;
