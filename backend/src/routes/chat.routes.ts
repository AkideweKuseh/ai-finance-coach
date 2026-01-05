/**
 * Chat Routes
 */

import { Router } from "express";
import {
  sendMessage,
  getConversation,
  clearConversation,
} from "../controllers/chat.controller";
import { authenticate } from "../middleware/auth.middleware";
import {
  chatMessageValidation,
  validate,
} from "../middleware/validate.middleware";

const router = Router();

// All chat routes require authentication
router.use(authenticate);

/**
 * POST /api/chat/message
 * Send message to AI and get response
 */
router.post("/message", chatMessageValidation, validate, sendMessage);

/**
 * GET /api/chat/conversation/:conversationId?
 * Get conversation history
 */
router.get("/conversation/:conversationId?", getConversation);

/**
 * DELETE /api/chat/conversation
 * Clear conversation history
 */
router.delete("/conversation", clearConversation);

export default router;
