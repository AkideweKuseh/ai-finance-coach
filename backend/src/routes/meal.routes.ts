/**
 * Meal Routes
 */

import { Router } from "express";
import {
  getMeals,
  getMealById,
  getMealLogs,
  logMeal,
  deleteMealLog,
  getMealSuggestions,
} from "../controllers/meal.controller";
import { authenticate } from "../middleware/auth.middleware";
import { mealLogValidation, validate } from "../middleware/validate.middleware";

const router = Router();

// All meal routes require authentication
router.use(authenticate);

/**
 * GET /api/meals
 * Get all available meals
 */
router.get("/", getMeals);

/**
 * GET /api/meals/suggestions
 * Get AI-powered meal suggestions
 */
router.get("/suggestions", getMealSuggestions);

/**
 * GET /api/meals/logs
 * Get user's meal logs
 * Optional query param: ?date=2024-01-05
 */
router.get("/logs", getMealLogs);

/**
 * POST /api/meals/logs
 * Log a meal
 */
router.post("/logs", mealLogValidation, validate, logMeal);

/**
 * DELETE /api/meals/logs/:logId
 * Delete a meal log
 */
router.delete("/logs/:logId", deleteMealLog);

/**
 * GET /api/meals/:id
 * Get meal by ID
 */
router.get("/:id", getMealById);

export default router;
