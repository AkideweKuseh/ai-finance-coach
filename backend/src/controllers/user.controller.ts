/**
 * User Controller
 *
 * Handles user profile and daily summary operations
 */

import { Response } from "express";
import { User } from "../models/User.model";
import { MealLog } from "../models/Meal.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { AppError, catchAsync } from "../middleware/error.middleware";

/**
 * Get user profile
 */
export const getProfile = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      data: user.toJSON(),
    });
  }
);

/**
 * Update user profile
 */
export const updateProfile = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const { name, profile } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Update name if provided
    if (name) {
      user.name = name;
    }

    // Update profile fields if provided
    if (profile) {
      // Recalculate nutrition goals if relevant fields changed
      const shouldRecalculate =
        profile.age !== undefined ||
        profile.height !== undefined ||
        profile.weight !== undefined ||
        profile.goal !== undefined ||
        profile.activityLevel !== undefined;

      if (shouldRecalculate) {
        const updatedProfile = {
          ...(user.profile as any).toObject(),
          ...profile,
        };
        const nutritionGoals = calculateNutritionGoals(updatedProfile);
        user.profile = { ...updatedProfile, ...nutritionGoals } as any;
      } else {
        user.profile = {
          ...(user.profile as any).toObject(),
          ...profile,
        } as any;
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user.toJSON(),
    });
  }
);

/**
 * Get daily summary (calories and macros)
 */
export const getDailySummary = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const dateParam = req.query.date as string;

    const user = await User.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Parse date or use today
    const date = dateParam ? new Date(dateParam) : new Date();
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    // Get all meal logs for the day
    const mealLogs = await MealLog.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    }).populate("mealId");

    // Calculate totals
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    mealLogs.forEach((log: any) => {
      const meal = log.mealId as any;
      const servings = log.servings;

      totalCalories += meal.calories * servings;
      totalProtein += meal.macros.protein * servings;
      totalCarbs += meal.macros.carbs * servings;
      totalFat += meal.macros.fat * servings;
    });

    // Calculate remaining
    const { dailyCalorieGoal, macroGoals } = user.profile;

    const summary = {
      date: startOfDay.toISOString(),
      caloriesConsumed: Math.round(totalCalories),
      macrosConsumed: {
        protein: Math.round(totalProtein),
        carbs: Math.round(totalCarbs),
        fat: Math.round(totalFat),
      },
      caloriesRemaining: Math.max(
        0,
        dailyCalorieGoal - Math.round(totalCalories)
      ),
      macrosRemaining: {
        protein: Math.max(0, macroGoals.protein - Math.round(totalProtein)),
        carbs: Math.max(0, macroGoals.carbs - Math.round(totalCarbs)),
        fat: Math.max(0, macroGoals.fat - Math.round(totalFat)),
      },
      mealsLogged: mealLogs.length,
    };

    res.status(200).json({
      success: true,
      data: summary,
    });
  }
);

/**
 * Delete user account
 */
export const deleteAccount = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    await User.findByIdAndDelete(userId);
    await MealLog.deleteMany({ userId });

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  }
);

// Helper function (duplicated from auth controller for independence)
const calculateNutritionGoals = (profile: any) => {
  const { age, height, weight, goal, activityLevel } = profile;
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    athlete: 1.9,
  };
  const tdee = bmr * (activityMultipliers[activityLevel] || 1.55);
  let dailyCalories = tdee;
  if (goal === "lose") dailyCalories = tdee - 500;
  else if (goal === "gain") dailyCalories = tdee + 300;

  const protein = Math.round((dailyCalories * 0.3) / 4);
  const carbs = Math.round((dailyCalories * 0.4) / 4);
  const fat = Math.round((dailyCalories * 0.3) / 9);

  return {
    dailyCalorieGoal: Math.round(dailyCalories),
    macroGoals: { protein, carbs, fat },
  };
};

export default {
  getProfile,
  updateProfile,
  getDailySummary,
  deleteAccount,
};
