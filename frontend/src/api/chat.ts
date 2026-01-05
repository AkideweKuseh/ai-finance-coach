/**
 * Chat API - AI conversation endpoints
 */

import apiClient, { handleApiError } from "./client";
import {
  SendMessageData,
  SendMessageResponse,
  ChatConversation,
} from "../types/chat";

/**
 * Send message to AI consultant
 */
export const sendMessage = async (
  data: SendMessageData
): Promise<SendMessageResponse> => {
  try {
    const response = await apiClient.post<SendMessageResponse>(
      "/chat/message",
      data
    );
    return response.data;
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

    const response = await apiClient.get<ChatConversation>(endpoint);
    return response.data;
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
