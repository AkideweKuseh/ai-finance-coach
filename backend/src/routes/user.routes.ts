/**
 * User Routes
 */

import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getDailySummary,
  deleteAccount,
} from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// All user routes require authentication
router.use(authenticate);

/**
 * GET /api/user/profile
 * Get current user profile
 */
router.get("/profile", getProfile);

/**
 * PUT /api/user/profile
 * Update user profile
 */
router.put("/profile", updateProfile);

/**
 * GET /api/user/daily-summary
 * Get daily calorie and macro summary
 * Optional query param: ?date=2024-01-05
 */
router.get("/daily-summary", getDailySummary);

/**
 * DELETE /api/user/account
 * Delete user account
 */
router.delete("/account", deleteAccount);

export default router;
