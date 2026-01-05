/**
 * AI Chat Screen
 * Chat interface with AI nutrition assistant
 */

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  useThemedColors,
} from "../theme";
import { ScreenContainer } from "../components/common/ScreenContainer";

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: string;
  mealCard?: MealCardData;
}

interface MealCardData {
  title: string;
  calories: number;
  prepTime: string;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl: string;
  tip?: string;
}

const AIMessage = ({ message }: { message: Message }) => {
  const themedColors = useThemedColors();
  return (
    <View style={styles.messageContainer}>
      <View style={styles.aiAvatarContainer}>
        <View style={styles.aiAvatar}>
          <Ionicons name="nutrition" size={20} color={colors.primary} />
        </View>
      </View>
      <View style={styles.messageContent}>
        <Text
          style={[styles.senderName, { color: themedColors.textSecondary }]}
        >
          NutriBot
        </Text>
        <View
          style={[
            styles.aiBubble,
            { backgroundColor: themedColors.surfaceLight },
          ]}
        >
          <Text style={[styles.aiText, { color: themedColors.textPrimary }]}>
            {message.text}
          </Text>
        </View>
        {message.mealCard && <MealCard data={message.mealCard} />}
      </View>
    </View>
  );
};

const UserMessage = ({ message }: { message: Message }) => {
  const themedColors = useThemedColors();
  return (
    <View style={styles.userMessageContainer}>
      <View style={styles.userMessageContent}>
        <Text
          style={[styles.userSenderName, { color: themedColors.textSecondary }]}
        >
          You
        </Text>
        <View style={styles.userBubble}>
          <Text style={styles.userText}>{message.text}</Text>
        </View>
      </View>
      <View style={styles.userAvatar}>
        <Text style={styles.userAvatarText}>ME</Text>
      </View>
    </View>
  );
};

const MealCard = ({ data }: { data: MealCardData }) => {
  const navigation = useNavigation();
  const themedColors = useThemedColors();

  return (
    <View style={[styles.mealCard, { backgroundColor: themedColors.surface }]}>
      <View style={styles.mealImageContainer}>
        <Image
          source={{ uri: data.imageUrl }}
          style={styles.mealImage}
          resizeMode="cover"
        />
        <View style={styles.mealImageOverlay} />
        <View style={styles.mealImageContent}>
          <Text style={styles.mealCardTitle}>{data.title}</Text>
          <View style={styles.prepTimeContainer}>
            <Ionicons name="time-outline" size={14} color="#FFFFFF" />
            <Text style={styles.prepTimeText}>{data.prepTime}</Text>
          </View>
        </View>
      </View>

      <View style={styles.mealCardBody}>
        <View style={styles.caloriesHeader}>
          <View style={styles.caloriesContainer}>
            <Text
              style={[
                styles.caloriesValue,
                { color: themedColors.textPrimary },
              ]}
            >
              {data.calories}
            </Text>
            <Text
              style={[
                styles.caloriesLabel,
                { color: themedColors.textSecondary },
              ]}
            >
              {"KCAL"}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.viewRecipeButton}
            onPress={() => {
              // @ts-ignore - Navigation typing
              navigation.navigate("MealDetail", { mealId: "1" });
            }}
          >
            <Text style={styles.viewRecipeText}>View Recipe</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.macrosContainer}>
          <View style={styles.macroRow}>
            <Text
              style={[styles.macroLabel, { color: themedColors.textSecondary }]}
            >
              Protein
            </Text>
            <View
              style={[
                styles.macroBarContainer,
                { backgroundColor: themedColors.surfaceLight },
              ]}
            >
              <View style={[styles.macroBar, { width: "75%" }]} />
            </View>
            <Text
              style={[styles.macroValue, { color: themedColors.textPrimary }]}
            >
              {data.protein}g
            </Text>
          </View>
          <View style={styles.macroRow}>
            <Text
              style={[styles.macroLabel, { color: themedColors.textSecondary }]}
            >
              Carbs
            </Text>
            <View
              style={[
                styles.macroBarContainer,
                { backgroundColor: themedColors.surfaceLight },
              ]}
            >
              <View
                style={[
                  styles.macroBar,
                  { width: "20%", backgroundColor: "#EAB308" },
                ]}
              />
            </View>
            <Text
              style={[styles.macroValue, { color: themedColors.textPrimary }]}
            >
              {data.carbs}g
            </Text>
          </View>
          <View style={styles.macroRow}>
            <Text
              style={[styles.macroLabel, { color: themedColors.textSecondary }]}
            >
              Fat
            </Text>
            <View
              style={[
                styles.macroBarContainer,
                { backgroundColor: themedColors.surfaceLight },
              ]}
            >
              <View
                style={[
                  styles.macroBar,
                  { width: "45%", backgroundColor: "#FB923C" },
                ]}
              />
            </View>
            <Text
              style={[styles.macroValue, { color: themedColors.textPrimary }]}
            >
              {data.fat}g
            </Text>
          </View>
        </View>

        {data.tip && (
          <View style={styles.tipContainer}>
            <Ionicons name="bulb" size={14} color="#F9A825" />
            <Text
              style={[styles.tipText, { color: themedColors.textSecondary }]}
            >
              <Text style={styles.tipLabel}>Pro Tip:</Text> {data.tip}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const QuickReply = ({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}) => {
  const themedColors = useThemedColors();
  return (
    <TouchableOpacity
      style={[
        styles.quickReplyChip,
        { backgroundColor: themedColors.surfaceLight },
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={16} color={colors.primary} />
      <Text
        style={[styles.quickReplyText, { color: themedColors.textPrimary }]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const AIChatScreen = () => {
  const themedColors = useThemedColors();
  const [inputText, setInputText] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [messages] = useState<Message[]>([
    {
      id: "1",
      text: "Good morning! Ready to plan your lunch? 🥗 Keeping your energy levels high is our goal today!",
      isAI: true,
      timestamp: "10:23 AM",
    },
    {
      id: "2",
      text: "I have chicken and avocado. What can I make?",
      isAI: false,
      timestamp: "10:24 AM",
    },
    {
      id: "3",
      text: "How about a Chicken Avocado Salad? 🥗 It's fresh, quick to make, and packs a protein punch! Here's a quick breakdown:",
      isAI: true,
      timestamp: "10:24 AM",
      mealCard: {
        title: "Chicken Avocado Salad",
        calories: 450,
        prepTime: "15 min prep",
        protein: 40,
        carbs: 12,
        fat: 15,
        imageUrl:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
        tip: "Add a squeeze of lemon for zest without extra calories! 🍋",
      },
    },
  ]);

  return (
    <ScreenContainer backgroundColor={themedColors.background}>
      {/* Header */}
      <View
        style={[styles.header, { backgroundColor: themedColors.background }]}
      >
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.headerAvatar,
              { backgroundColor: themedColors.surfaceLight },
            ]}
          >
            <Ionicons name="nutrition" size={18} color={colors.primary} />
          </View>
          <View>
            <Text
              style={[styles.headerTitle, { color: themedColors.textPrimary }]}
            >
              NutriBot
            </Text>
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDot} />
              <Text
                style={[
                  styles.onlineText,
                  { color: themedColors.textSecondary },
                ]}
              >
                Online
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons
            name="ellipsis-vertical"
            size={20}
            color={colors.textSecondaryDark}
          />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.timestamp}>
          <Text style={styles.timestampText}>Today, 10:23 AM</Text>
        </View>

        {messages.map((message) =>
          message.isAI ? (
            <AIMessage key={message.id} message={message} />
          ) : (
            <UserMessage key={message.id} message={message} />
          )
        )}
      </ScrollView>

      {/* Bottom Input Area - Floating */}
      <View
        style={[
          styles.bottomContainer,
          isInputFocused && styles.bottomContainerExpanded,
          {
            backgroundColor: themedColors.background,
            borderTopColor: themedColors.border,
          },
        ]}
      >
        {/* Quick Reply Chips - Only show when focused */}
        {isInputFocused && (
          <ScrollView
            horizontal
            style={styles.quickRepliesContainer}
            contentContainerStyle={styles.quickRepliesContent}
            showsHorizontalScrollIndicator={false}
          >
            <QuickReply icon="restaurant" label="Log Lunch" />
            <QuickReply icon="pizza" label="Suggest Snack" />
            <QuickReply icon="time" label="Sho..." />
          </ScrollView>
        )}

        {/* Input Field */}
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: themedColors.background },
          ]}
        >
          <TouchableOpacity style={styles.cameraButton}>
            <Ionicons
              name="camera"
              size={22}
              color={themedColors.textSecondary}
            />
          </TouchableOpacity>

          <View
            style={[
              styles.inputWrapper,
              {
                backgroundColor: themedColors.surfaceAlt,
                borderColor: themedColors.border,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: themedColors.textPrimary }]}
              placeholder="Type a message or log food..."
              placeholderTextColor={themedColors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              textAlignVertical="center"
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />
            <TouchableOpacity style={styles.micButton}>
              <Ionicons
                name="mic"
                size={18}
                color={themedColors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.sendButton}>
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.backgroundDark,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceDarkLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimaryDark,
    fontFamily: typography.fontFamily.display,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  onlineStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  onlineText: {
    fontSize: 11,
    color: colors.textSecondaryDark,
    fontWeight: "400",
    fontFamily: typography.fontFamily.body,
  },
  menuButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.md,
    paddingBottom: 120,
    gap: spacing.screenPadding,
  },
  timestamp: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  timestampText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.textSecondaryDark,
    backgroundColor: colors.surfaceDarkLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
    fontFamily: typography.fontFamily.body,
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    maxWidth: "85%",
  },
  aiAvatarContainer: {
    width: 32,
    height: 32,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceDarkLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  messageContent: {
    flex: 1,
    gap: 4,
  },
  senderName: {
    fontSize: 12,
    color: "#a3b2a4",
    marginLeft: 4,
    fontFamily: typography.fontFamily.body,
  },
  aiBubble: {
    backgroundColor: "#2A2D31",
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  aiText: {
    fontSize: 14,
    color: "#E5E5E5",
    lineHeight: 20,
    fontFamily: typography.fontFamily.body,
  },
  userMessageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    gap: 12,
    maxWidth: "85%",
    alignSelf: "flex-end",
  },
  userMessageContent: {
    flex: 1,
    gap: 4,
    alignItems: "flex-end",
  },
  userSenderName: {
    fontSize: 12,
    color: "#a3b2a4",
    marginRight: 4,
    fontFamily: typography.fontFamily.body,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    padding: 14,
  },
  userText: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
    fontFamily: typography.fontFamily.body,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatarText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: typography.fontFamily.display,
  },
  mealCard: {
    marginTop: 8,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceDark,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    ...shadows.lg,
  },
  mealImageContainer: {
    height: 160,
    position: "relative",
  },
  mealImage: {
    width: "100%",
    height: "100%",
  },
  mealImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  mealImageContent: {
    position: "absolute",
    bottom: 12,
    left: 12,
  },
  mealCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    fontFamily: typography.fontFamily.display,
  },
  prepTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  prepTimeText: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.9,
    fontFamily: typography.fontFamily.body,
  },
  mealCardBody: {
    padding: spacing.md,
  },
  caloriesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  caloriesContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  caloriesValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimaryDark,
    fontFamily: typography.fontFamily.display,
  },
  caloriesLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondaryDark,
    fontFamily: typography.fontFamily.display,
  },
  viewRecipeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewRecipeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontFamily: typography.fontFamily.display,
  },
  macrosContainer: {
    gap: 12,
  },
  macroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  macroLabel: {
    width: 48,
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondaryDark,
    fontFamily: typography.fontFamily.body,
  },
  macroBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceDarkLight,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  macroBar: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  macroValue: {
    width: 32,
    fontSize: 12,
    fontWeight: "700",
    color: colors.textPrimaryDark,
    textAlign: "right",
    fontFamily: typography.fontFamily.display,
  },
  tipContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "rgba(249, 168, 37, 0.1)",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(249, 168, 37, 0.2)",
    marginTop: spacing.md,
    marginHorizontal: -spacing.md,
    marginBottom: -spacing.md,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: "#FDB462",
    lineHeight: 18,
    fontFamily: typography.fontFamily.body,
  },
  tipLabel: {
    fontWeight: "700",
    color: "#F9A825",
    fontFamily: typography.fontFamily.display,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 68,
    left: 0,
    right: 0,
    backgroundColor: colors.backgroundDark,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
  },
  bottomContainerExpanded: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "rgba(26, 27, 30, 0.98)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    ...shadows.lg,
  },
  quickRepliesContainer: {
    marginBottom: spacing.sm,
    maxHeight: 40,
  },
  quickRepliesContent: {
    gap: 8,
    paddingRight: spacing.md,
  },
  quickReplyChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#2A2D31",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 18,
  },
  quickReplyText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textPrimaryDark,
    fontFamily: typography.fontFamily.body,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cameraButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 14,
    paddingRight: 2,
    minHeight: 40,
    maxHeight: 100,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimaryDark,
    paddingVertical: 10,
    paddingRight: 6,
    includeFontPadding: false,
    fontFamily: typography.fontFamily.body,
  },
  micButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.md,
  },
});

export default AIChatScreen;
