/**
 * Google Gemini Service Implementation
 *
 * Implements the AI provider interface for Google's Gemini models
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  IAIProvider,
  AIMessage,
  AIResponse,
  AIConfig,
} from "./provider.interface";

export class GeminiService implements IAIProvider {
  private client: GoogleGenerativeAI;
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
    this.client = new GoogleGenerativeAI(config.apiKey);
  }

  /**
   * Send chat completion request to Gemini
   */
  async chat(messages: AIMessage[], userContext?: string): Promise<AIResponse> {
    try {
      const model = this.client.getGenerativeModel({
        model: this.config.model,
      });

      // Build the prompt by combining system context and messages
      const systemPrompt = this.getSystemPrompt(userContext);

      // Convert messages to Gemini format
      const conversationHistory = messages
        .map((msg) => {
          const role = msg.role === "assistant" ? "model" : "user";
          return `${role}: ${msg.content}`;
        })
        .join("\n\n");

      const fullPrompt = `${systemPrompt}\n\n=== Conversation ===\n${conversationHistory}`;

      // Generate response
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      return {
        content: text || "I apologize, I could not generate a response.",
        finishReason: "stop",
        tokensUsed: undefined, // Gemini doesn't provide token count in same way
      };
    } catch (error: any) {
      console.error("Gemini API error:", error.message);
      throw new Error(`Gemini error: ${error.message}`);
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
    return "Google Gemini";
  }

  /**
   * Check if configured
   */
  isConfigured(): boolean {
    return !!this.config.apiKey && !!this.config.model;
  }
}

export default GeminiService;
