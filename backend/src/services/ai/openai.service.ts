/**
 * OpenAI Service Implementation
 *
 * Implements the AI provider interface for OpenAI's GPT models
 */

import OpenAI from "openai";
import {
  IAIProvider,
  AIMessage,
  AIResponse,
  AIConfig,
} from "./provider.interface";

export class OpenAIService implements IAIProvider {
  private client: OpenAI;
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.apiKey,
    });
  }

  /**
   * Send chat completion request to OpenAI
   */
  async chat(messages: AIMessage[], userContext?: string): Promise<AIResponse> {
    try {
      // Add system message with nutrition expert context
      const systemMessage: AIMessage = {
        role: "system",
        content: this.getSystemPrompt(userContext),
      };

      // Combine system message with conversation
      const allMessages = [systemMessage, ...messages];

      // Call OpenAI API
      const response = await this.client.chat.completions.create({
        model: this.config.model,
        messages: allMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: this.config.temperature || 0.7,
        max_tokens: this.config.maxTokens || 1000,
      });

      const completion = response.choices[0];

      return {
        content:
          completion.message.content ||
          "I apologize, I could not generate a response.",
        finishReason: completion.finish_reason,
        tokensUsed: response.usage?.total_tokens,
      };
    } catch (error: any) {
      console.error("OpenAI API error:", error.message);
      throw new Error(`OpenAI error: ${error.message}`);
    }
  }

  /**
   * Get system prompt for nutrition expert
   */
  private getSystemPrompt(userContext?: string): string {
    let prompt = `You are NutriBot, a friendly and knowledgeable AI nutrition expert assistant. Your role is to:

1. STRICTLY provide nutrition and dietary advice ONLY
2. Politely decline non-nutrition questions
3. Give safe, general dietary guidance (not medical diagnosis)
4. Be supportive, friendly, and encouraging
5. Use light food & health-related emojis (🥗, 🥑, 💪, 🍎, etc.)
6. Keep responses concise and well-formatted with:
   - Clear headings
   - Bullet points
   - Short paragraphs
7. When suggesting meals, include:
   - Calorie count
   - Macro breakdown (protein, carbs, fat)
   - Preparation time
   - Simple instructions

IMPORTANT SAFETY RULES:
- Never diagnose medical conditions
- Always recommend consulting healthcare professionals for medical concerns
- Provide general healthy eating advice only
- Be cautious with special dietary needs (allergies, conditions)
- Encourage balanced, sustainable eating habits

Your tone should be: supportive, professional, friendly, and fun!`;

    if (userContext) {
      prompt += `\n\nUSER PROFILE CONTEXT:\n${userContext}`;
    }

    return prompt;
  }

  /**
   * Get provider name
   */
  getProviderName(): string {
    return "OpenAI";
  }

  /**
   * Check if configured
   */
  isConfigured(): boolean {
    return !!this.config.apiKey && !!this.config.model;
  }
}

export default OpenAIService;
