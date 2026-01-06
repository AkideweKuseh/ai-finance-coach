/**
 * Chat API - AI conversation endpoints
 */

import apiClient, { handleApiError } from "./client";
import {
  SendMessageData,
  SendMessageResponse,
  ChatConversation,
} from "../types/chat";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: unknown;
};

/**
 * Send message to AI consultant
 */
export const sendMessage = async (
  data: SendMessageData
): Promise<SendMessageResponse> => {
  try {
    const response = await apiClient.post<ApiResponse<SendMessageResponse>>(
      "/chat/message",
      data
    );

    if (!response.data?.data) {
      throw new Error(response.data?.message || "Invalid server response");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Get conversation history
 */
export const getConversation = async (
  conversationId?: string
): Promise<ChatConversation> => {
  try {
    const endpoint = conversationId
      ? `/chat/conversation/${conversationId}`
      : "/chat/conversation";

    const response = await apiClient.get<ApiResponse<ChatConversation>>(
      endpoint
    );

    if (!response.data?.data) {
      throw new Error(response.data?.message || "Invalid server response");
    }

    return response.data.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

/**
 * Clear conversation history
 */
export const clearConversation = async (): Promise<void> => {
  try {
    await apiClient.delete("/chat/conversation");
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default {
  sendMessage,
  getConversation,
  clearConversation,
};
