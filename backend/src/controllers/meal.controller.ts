/**
 * Meal Controller
 *
 * Handles meal data, logging, and suggestions
 */

import { Response } from "express";
import { Meal, MealLog } from "../models/Meal.model";
import { User } from "../models/User.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { AppError, catchAsync } from "../middleware/error.middleware";

/**
 * Get all meals
 */
export const getMeals = catchAsync(async (req: AuthRequest, res: Response) => {
  const meals = await Meal.find().sort({ name: 1 });

  res.status(200).json({
    success: true,
    data: meals,
  });
});

/**
 * Get meal by ID
 */
export const getMealById = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    const meal = await Meal.findById(id);

    if (!meal) {
      throw new AppError("Meal not found", 404);
    }

    res.status(200).json({
      success: true,
      data: meal,
    });
  }
);

/**
 * Get user's meal logs
 */
export const getMealLogs = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const dateParam = req.query.date as string;

    let query: any = { userId };

    if (dateParam) {
      const date = new Date(dateParam);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const logs = await MealLog.find(query)
      .populate("mealId")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: logs,
    });
  }
);

/**
 * Log a meal
 */
export const logMeal = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { mealId, date, mealType, servings } = req.body;

  // Verify meal exists
  const meal = await Meal.findById(mealId);

  if (!meal) {
    throw new AppError("Meal not found", 404);
  }

  // Create meal log
  const mealLog = await MealLog.create({
    userId,
    mealId,
    date: new Date(date),
    mealType,
    servings,
  });

  // Populate meal data for response
  await mealLog.populate("mealId");

  res.status(201).json({
    success: true,
    message: "Meal logged successfully",
    data: mealLog,
  });
});

/**
 * Delete meal log
 */
export const deleteMealLog = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const { logId } = req.params;

    const log = await MealLog.findOne({ _id: logId, userId });

    if (!log) {
      throw new AppError("Meal log not found", 404);
    }

    await log.deleteOne();

    res.status(200).json({
      success: true,
      message: "Meal log deleted successfully",
    });
  }
);

/**
 * Get AI-powered meal suggestions
 */
export const getMealSuggestions = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Get all meals
    const allMeals = await Meal.find();

    // Simple scoring algorithm based on user profile
    const { dailyCalorieGoal, macroGoals, dietaryPreferences } = user.profile;

    const scoredMeals = allMeals.map((meal: any) => {
      let score = 50; // Base score

      // Prefer meals within calorie range (30% of daily goal per meal)
      const idealMealCalories = dailyCalorieGoal * 0.3;
      const calorieDiff = Math.abs(meal.calories - idealMealCalories);
      score += Math.max(0, 20 - calorieDiff / 50); // Max +20 points

      // Prefer high protein if goal is gain or maintain
      if (user.profile.goal !== "lose" && meal.macros.protein > 30) {
        score += 10;
      }

      // Match dietary preferences
      const mealTags = meal.tags || [];
      const matchingPrefs = dietaryPreferences.filter((pref: string) =>
        mealTags.includes(pref.toLowerCase())
      );
      score += matchingPrefs.length * 10;

      // Prefer highly rated meals
      if (meal.rating && meal.rating >= 4.5) {
        score += 10;
      }

      return {
        meal,
        matchScore: Math.min(100, Math.round(score)),
        reason: generateSuggestionReason(meal, user.profile),
        aiPick: score > 70,
      };
    });

    // Sort by score and take top 5
    const topSuggestions = scoredMeals
      .sort((a: any, b: any) => b.matchScore - a.matchScore)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: topSuggestions,
    });
  }
);

/**
 * Generate reason for meal suggestion
 */
const generateSuggestionReason = (meal: any, profile: any): string => {
  const reasons: string[] = [];

  if (meal.macros.protein > 30) {
    reasons.push("High in protein");
  }

  if (meal.prepTime < 20) {
    reasons.push("Quick to prepare");
  }

  if (meal.tags.includes("low-carb") && profile.goal === "lose") {
    reasons.push("Great for your weight loss goal");
  }

  if (meal.difficulty === "easy") {
    reasons.push("Easy to make");
  }

  return reasons.length > 0 ? reasons.join(" • ") : "Balanced nutrition";
};

export default {
  getMeals,
  getMealById,
  getMealLogs,
  logMeal,
  deleteMealLog,
  getMealSuggestions,
};
