/**
 * Chat Controller
 *
 * Handles AI chat conversations and messages
 */

import { Response } from "express";
import { Chat } from "../models/Chat.model";
import { User } from "../models/User.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { AppError, catchAsync } from "../middleware/error.middleware";
import { aiService } from "../services/ai/aiService";
import { AIMessage } from "../services/ai/provider.interface";

/**
 * Send message to AI and get response
 */
export const sendMessage = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const { content, includeProfile } = req.body;

    // Get or create conversation
    let conversation = await Chat.findOne({ userId });

    if (!conversation) {
      conversation = await Chat.create({
        userId,
        messages: [],
      });
    }

    // Add user message
    const userMessage = {
      role: "user" as const,
      content,
      timestamp: new Date(),
    };

    conversation.messages.push(userMessage);

    // Get user context if requested
    let userContext: string | undefined;

    if (includeProfile) {
      const user = await User.findById(userId);
      if (user) {
        userContext = aiService.formatUserContext(user);
      }
    }

    try {
      // Convert messages to AI format (last 10 messages for context)
      const recentMessages = conversation.messages.slice(-10);
      const aiMessages: AIMessage[] = recentMessages.map((msg: any) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      // Get AI response
      const aiResponse = await aiService.chat(aiMessages, userContext);

      // Add assistant message
      const assistantMessage = {
        role: "assistant" as const,
        content: aiResponse.content,
        timestamp: new Date(),
      };

      conversation.messages.push(assistantMessage);

      await conversation.save();

      res.status(200).json({
        success: true,
        data: {
          message: assistantMessage,
          conversationId: conversation._id,
        },
      });
    } catch (error: any) {
      // Add error message to conversation
      const errorMessage = {
        role: "assistant" as const,
        content:
          "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        metadata: {
          error: true,
          errorMessage: error.message,
        },
      };

      conversation.messages.push(errorMessage);
      await conversation.save();

      res.status(200).json({
        success: true,
        data: {
          message: errorMessage,
          conversationId: conversation._id,
        },
      });
    }
  }
);

/**
 * Get conversation history
 */
export const getConversation = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const conversationId = req.params.conversationId;

    let conversation;

    if (conversationId) {
      conversation = await Chat.findOne({ _id: conversationId, userId });
    } else {
      conversation = await Chat.findOne({ userId });
    }

    if (!conversation) {
      // Return empty conversation
      res.status(200).json({
        success: true,
        data: {
          _id: null,
          userId,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  }
);

/**
 * Clear conversation history
 */
export const clearConversation = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    await Chat.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: "Conversation cleared successfully",
    });
  }
);

export default {
  sendMessage,
  getConversation,
  clearConversation,
};
