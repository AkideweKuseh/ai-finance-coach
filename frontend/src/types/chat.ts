/**
 * Chat Type Definitions
 */

export interface ChatMessage {
  _id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;

  // Optional rich content
  metadata?: MessageMetadata;
}

export interface MessageMetadata {
  // For meal suggestions
  mealSuggestion?: {
    mealId: string;
    mealName: string;
    mealImage?: string;
    calories: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
  };

  // For quick actions
  quickReplies?: string[];

  // Error state
  error?: boolean;
  errorMessage?: string;
}

export interface ChatConversation {
  _id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SendMessageData {
  content: string;
  includeProfile?: boolean; // Include user profile in context
}

export interface SendMessageResponse {
  message: ChatMessage;
  conversationId: string;
}

export interface QuickReply {
  id: string;
  label: string;
  icon?: string;
  action: "send" | "log" | "suggest";
}

export const defaultQuickReplies: QuickReply[] = [
  {
    id: "log-lunch",
    label: "Log Lunch",
    icon: "edit_note",
    action: "log",
  },
  {
    id: "suggest-snack",
    label: "Suggest Snack",
    icon: "cookie",
    action: "send",
  },
  {
    id: "show-macros",
    label: "Show Macros",
    icon: "donut_large",
    action: "send",
  },
  {
    id: "log-water",
    label: "Log Water",
    icon: "water_drop",
    action: "log",
  },
];
