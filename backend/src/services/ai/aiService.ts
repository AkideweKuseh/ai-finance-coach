/**
 * AI Service - Provider Abstraction Layer
 *
 * This is the SINGLE entry point for all AI operations.
 * Automatically routes to the correct provider based on environment config.
 *
 * CRITICAL: No code changes needed to switch providers - just update .env
 */

import { config } from "../../config/environment";
import { IAIProvider, AIMessage, AIResponse } from "./provider.interface";
import { OpenAIService } from "./openai.service";
import { GeminiService } from "./gemini.service";

class AIService {
  private provider: IAIProvider;

  constructor() {
    // Initialize provider based on environment configuration
    this.provider = this.initializeProvider();

    console.log(
      `🤖 AI Provider initialized: ${this.provider.getProviderName()}`
    );

    if (!this.provider.isConfigured()) {
      console.warn(
        "⚠️  AI Provider is not properly configured. Check your environment variables."
      );
    }
  }

  /**
   * Initialize the correct AI provider based on config
   */
  private initializeProvider(): IAIProvider {
    const providerType = config.ai.provider;

    switch (providerType) {
      case "openai":
        return new OpenAIService({
          apiKey: config.ai.openai.apiKey,
          model: config.ai.openai.model,
          temperature: 0.7,
          maxTokens: 1000,
        });

      case "gemini":
        return new GeminiService({
          apiKey: config.ai.gemini.apiKey,
          model: config.ai.gemini.model,
          temperature: 0.7,
        });

      default:
        throw new Error(`Unsupported AI provider: ${providerType}`);
    }
  }

  /**
   * Send a chat message to the AI
   *
   * @param messages - Conversation history
   * @param userContext - Optional user profile context
   * @returns AI response
   */
  async chat(
    messages: AIMessage[],
    userContext?: string,
    imageBase64?: string,
    imageMimeType?: string
  ): Promise<AIResponse> {
    try {
      if (!this.provider.isConfigured()) {
        throw new Error("AI provider is not properly configured");
      }

      const response = await this.provider.chat(messages, userContext, imageBase64, imageMimeType);
      return response;
    } catch (error: any) {
      console.error("AI Service error:", error.message);

      // Return fallback response
      return {
        content: `I apologize, but I'm having trouble processing your request right now. This could be due to:

🔧 Technical issues with the AI service
🔑 Configuration problems
📡 Network connectivity

Please try again in a moment. If the problem persists, contact support.`,
        finishReason: "error",
      };
    }
  }

  /**
   * Get current provider name
   */
  getProviderName(): string {
    return this.provider.getProviderName();
  }

  /**
   * Format user profile as context for AI
   */
  formatUserContext(user: any): string {
    if (!user || !user.profile) {
      return "";
    }

    const { profile } = user;

    return `
User: ${user.name}
Age: ${profile.age}
Monthly Income: ${profile.monthlyIncome}
Risk Tolerance: ${profile.riskTolerance}
Primary Goal: ${profile.primaryGoal}
Spending Categories: ${profile.spendingCategories.join(", ") || "None"}

Provide personalized advice based on this financial context.
`.trim();
  }
}

// Export singleton instance
export const aiService = new AIService();

export default aiService;
