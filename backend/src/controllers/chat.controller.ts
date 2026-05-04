/**
 * Chat Controller
 *
 * Handles multi-conversation AI chat
 */

import { Response } from "express";
import { Chat } from "../models/Chat.model";
import { User } from "../models/User.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { AppError, catchAsync } from "../middleware/error.middleware";
import { aiService } from "../services/ai/aiService";
import { AIMessage } from "../services/ai/provider.interface";

export const listConversations = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  const conversations = await Chat.find({ userId }).sort({ updatedAt: -1 }).lean();

  const summaries = conversations.map((conv) => ({
    _id: conv._id,
    title: conv.title,
    updatedAt: conv.updatedAt,
    lastMessage:
      conv.messages.length > 0
        ? {
            content: conv.messages[conv.messages.length - 1].content.substring(0, 80),
            role: conv.messages[conv.messages.length - 1].role,
          }
        : null,
  }));

  res.status(200).json({ success: true, data: summaries });
});

export const createConversation = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  const conversation = await Chat.create({ userId, title: "New Chat", messages: [] });

  res.status(201).json({
    success: true,
    data: { _id: conversation._id, title: conversation.title },
  });
});

export const sendMessage = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) throw new AppError("Unauthorized", 401);

  const { content, conversationId, imageBase64, imageMimeType } = req.body;
  if (!conversationId) throw new AppError("conversationId is required", 400);

  const conversation = await Chat.findOne({ _id: conversationId, userId });
  if (!conversation) throw new AppError("Conversation not found", 404);

  conversation.messages.push({ role: "user", content, timestamp: new Date() });

  // Auto-title from first user message
  if (conversation.messages.filter((m) => m.role === "user").length === 1) {
    conversation.title = content.substring(0, 50).trim();
  }

  let userContext: string | undefined;
  const user = await User.findById(userId);
  if (user) userContext = aiService.formatUserContext(user);

  try {
    const recentMessages = conversation.messages.slice(-105);
    const aiMessages: AIMessage[] = recentMessages.map((msg: any) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    const aiResponse = await aiService.chat(aiMessages, userContext, imageBase64, imageMimeType);

    const assistantMessage = {
      role: "assistant" as const,
      content: aiResponse.content,
      timestamp: new Date(),
    };
    conversation.messages.push(assistantMessage);
    await conversation.save();

    res.status(200).json({
      success: true,
      data: { message: assistantMessage, conversationId: conversation._id },
    });
  } catch (error: any) {
    const errorMessage = {
      role: "assistant" as const,
      content: "I apologize, but I encountered an error processing your request. Please try again.",
      timestamp: new Date(),
      metadata: { error: true, errorMessage: error.message },
    };
    conversation.messages.push(errorMessage);
    await conversation.save();

    res.status(200).json({
      success: true,
      data: { message: errorMessage, conversationId: conversation._id },
    });
  }
});

export const getConversation = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { conversationId } = req.params;

  const conversation = await Chat.findOne({ _id: conversationId, userId });

  if (!conversation) {
    res.status(200).json({
      success: true,
      data: {
        _id: null,
        userId,
        title: "New Chat",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return;
  }

  res.status(200).json({ success: true, data: conversation });
});

export const clearConversation = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { conversationId } = req.params;

  await Chat.findOneAndDelete({ _id: conversationId, userId });

  res.status(200).json({ success: true, message: "Conversation deleted successfully" });
});

export default { listConversations, createConversation, sendMessage, getConversation, clearConversation };
