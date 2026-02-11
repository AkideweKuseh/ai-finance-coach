/**
 * AI Chat Screen
 * Chat interface with AI financial coach
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import Markdown from "react-native-markdown-display";
import {
  colors,
  spacing,
  typography,
  radius,
  useThemedColors,
} from "../theme";
import { ScreenContainer } from "../components/common/ScreenContainer";
import * as chatApi from "../api/chat";
import { ChatMessage, ChatConversation } from "../types/chat";

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: string;
}

const copyMessageText = async (value: string) => {
  try {
    await Clipboard.setStringAsync(value);
  } catch {
    // best-effort
  }
};

const AIMessage = ({ message }: { message: Message }) => {
  const themedColors = useThemedColors();
  const markdownStyle = useMemo(
    () => ({
      body: {
        color: themedColors.textPrimary,
        fontFamily: typography.fontFamily.body,
        fontSize: 16,
      },
      link: { color: colors.primary },
    }),
    [themedColors]
  );

  return (
    <View style={styles.messageContainer}>
      <View style={styles.aiAvatarContainer}>
        <View style={styles.aiAvatar}>
          <Ionicons name="wallet-outline" size={20} color={colors.primary} />
        </View>
      </View>
      <View style={styles.messageContent}>
        <Text style={[styles.senderName, { color: themedColors.textSecondary }]}>
          FinanceBot
        </Text>
        <Pressable
          onLongPress={() => copyMessageText(message.text)}
          delayLongPress={250}
        >
          <View style={[styles.aiBubble, { backgroundColor: themedColors.surfaceLight }]}>
            <Markdown style={markdownStyle}>{message.text}</Markdown>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const UserMessage = ({ message }: { message: Message }) => {
  const themedColors = useThemedColors();
  
  return (
    <View style={styles.userMessageContainer}>
      <View style={styles.userMessageContent}>
        <Text style={[styles.userSenderName, { color: themedColors.textSecondary }]}>
          You
        </Text>
        <Pressable
          onLongPress={() => copyMessageText(message.text)}
          delayLongPress={250}
        >
          <View style={styles.userBubble}>
            <Text style={styles.userMessageText}>{message.text}</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.userAvatar}>
        <Text style={styles.userAvatarText}>ME</Text>
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
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const enableFocusedFooterUI = Platform.OS === "ios";
  const [inputText, setInputText] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const formatTime = (value: Date) => {
    return value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const toUiMessage = (msg: ChatMessage): Message => {
    return {
      id: msg._id || `msg-${Date.now()}-${Math.random()}`,
      text: msg.content,
      isAI: msg.role === "assistant",
      timestamp: formatTime(new Date(msg.timestamp)),
    };
  };

  useEffect(() => {
    const loadConversation = async () => {
      try {
        const conv = await chatApi.getConversation();
        if (conv?.messages) {
           const mapped = conv.messages.map(toUiMessage);
           if (mapped.length > 0) setMessages(mapped);
           else setMessages([{
             id: 'welcome',
             text: "Hi! I'm your AI Financial Coach. Ask me about your spending, budget, or financial goals.",
             isAI: true,
             timestamp: formatTime(new Date())
           }]);
        }
      } catch (e) {
          // ignore
      }
    };
    loadConversation();
  }, []);


  const handleSend = async () => {
    const content = inputText.trim();
    if (!content || isSending) return;

    setInputText("");
    setIsSending(true);

    const optimistic: Message = {
      id: `local-${Date.now()}`,
      text: content,
      isAI: false,
      timestamp: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, optimistic]);

    try {
      const response = await chatApi.sendMessage({ content });
      const assistant = toUiMessage(response.message);
      setMessages((prev) => [...prev, assistant]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-send-${Date.now()}`,
          text: "I'm having trouble connecting. Please try again.",
          isAI: true,
          timestamp: "",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ScreenContainer
      backgroundColor={themedColors.background}
      withKeyboardAvoidingView={Platform.OS === "ios"}
    >
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
            <Ionicons name="chatbubbles" size={18} color={colors.primary} />
          </View>
          <View>
            <Text
              style={[styles.headerTitle, { color: themedColors.textPrimary }]}
            >
              FinanceBot
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
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        <View style={styles.timestamp}>
          <Text style={styles.timestampText}>Today</Text>
        </View>

        {messages.map((message) =>
          message.isAI ? (
            <AIMessage key={message.id} message={message} />
          ) : (
            <UserMessage key={message.id} message={message} />
          )
        )}
      </ScrollView>

      {/* Bottom Input Area */}
      <View
        style={[
          styles.bottomContainer,
          enableFocusedFooterUI &&
            isInputFocused &&
            styles.bottomContainerExpanded,
          {
            backgroundColor: themedColors.background,
            borderTopColor: themedColors.border,
            marginBottom:
              Platform.OS === "android"
                ? Math.max(0, tabBarHeight - insets.bottom)
                : 0,
          },
        ]}
      >
        {enableFocusedFooterUI && isInputFocused && (
          <ScrollView
            horizontal
            style={styles.quickRepliesContainer}
            contentContainerStyle={styles.quickRepliesContent}
            showsHorizontalScrollIndicator={false}
          >
            <QuickReply icon="cash" label="Analyze Spend" onPress={() => setInputText("Analyze my spending for this month")} />
            <QuickReply icon="trending-up" label="Budget Tips" onPress={() => setInputText("Give me some tips to save money")} />
            <QuickReply icon="alert-circle" label="Over Budget?" onPress={() => setInputText("Am I over my budget?")} />
          </ScrollView>
        )}

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: themedColors.background },
          ]}
        >
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
              placeholder="Ask about your finances..."
              placeholderTextColor={themedColors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              onFocus={() => enableFocusedFooterUI && setIsInputFocused(true)}
              onBlur={() => enableFocusedFooterUI && setIsInputFocused(false)}
            />
          </View>

          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSend}
            disabled={isSending || !inputText.trim()}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
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
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
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
    fontWeight: "400",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.md,
    paddingBottom: 120,
    gap: spacing.md,
  },
  timestamp: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  timestampText: {
    fontSize: 12,
    color: colors.gray[500],
  },
  messageContainer: {
    flexDirection: "row",
    gap: 12,
    paddingRight: 40,
  },
  aiAvatarContainer: {
      justifyContent: 'flex-end',
      paddingBottom: 4,
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceDarkLight,
    alignItems: "center",
    justifyContent: "center",
  },
  messageContent: {
    flex: 1,
    gap: 4,
  },
  senderName: {
    fontSize: 12,
    marginLeft: 4,
  },
  aiBubble: {
    padding: 12,
    borderRadius: radius.xl,
    borderBottomLeftRadius: 4,
  },
  userMessageContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    paddingLeft: 40,
  },
  userMessageContent: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 4,
  },
  userSenderName: {
    fontSize: 12,
    marginRight: 4,
  },
  userBubble: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: radius.xl,
    borderBottomRightRadius: 4,
  },
  userMessageText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  userAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 'auto',
  },
  userAvatarText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: 'bold',
  },
  bottomContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
  },
  bottomContainerExpanded: {
      paddingBottom: 12,
  },
  quickRepliesContainer: {
    marginBottom: spacing.md,
  },
  quickRepliesContent: {
      gap: 8,
      paddingHorizontal: 4,
  },
  quickReplyChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: radius.full,
  },
  quickReplyText: {
      fontSize: 12,
      fontWeight: '600',
  },
  inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 8,
  },
  inputWrapper: {
      flex: 1,
      minHeight: 44,
      borderRadius: 22,
      borderWidth: 1,
      paddingHorizontal: 16,
      justifyContent: 'center',
  },
  input: {
      fontSize: 16,
      maxHeight: 100,
      paddingVertical: 8,
  },
  sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
  },
});

export default AIChatScreen;
