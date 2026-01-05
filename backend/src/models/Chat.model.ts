/**
 * Chat Model - MongoDB Schema
 *
 * Stores chat conversations and messages with AI assistant
 */

import mongoose, { Schema, Document } from "mongoose";

export interface IMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
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
    quickReplies?: string[];
    error?: boolean;
    errorMessage?: string;
  };
}

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      required: true,
      enum: ["user", "assistant"],
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  { _id: true }
);

const ChatSchema = new Schema<IChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
);

// Index for faster user lookups
ChatSchema.index({ userId: 1 });

// Limit message history to last 50 messages for performance
ChatSchema.pre("save", function (this: any, next: any) {
  if (this.messages.length > 50) {
    this.messages = this.messages.slice(-50);
  }
  next();
});

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;
