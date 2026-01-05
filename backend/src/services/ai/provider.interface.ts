/**
 * AI Provider Interface
 *
 * Abstract interface for AI providers (OpenAI, Gemini, etc.)
 * This ensures consistent AI integration regardless of provider
 */

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse {
  content: string;
  finishReason: string;
  tokensUsed?: number;
}

export interface AIConfig {
  model: string;
  apiKey: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * AI Provider Interface
 * All AI providers must implement this interface
 */
export interface IAIProvider {
  /**
   * Send a chat completion request
   */
  chat(messages: AIMessage[], userContext?: string): Promise<AIResponse>;

  /**
   * Get provider name
   */
  getProviderName(): string;

  /**
   * Check if provider is configured correctly
   */
  isConfigured(): boolean;
}

export default IAIProvider;
