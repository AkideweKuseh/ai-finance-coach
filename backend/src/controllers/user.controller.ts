/**
 * User Controller
 *
 * Handles user profile and spending summary operations
 */

import { Response } from "express";
import { User } from "../models/User.model";
import { Transaction } from "../models/Transaction.model"; // Changed MealLog to Transaction
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
      user.profile = {
        ...(user.profile as any).toObject(),
        ...profile,
      } as any;
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
 * Get spending summary
 */
export const getSpendingSummary = catchAsync(
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

    // Get all transactions for the day
    const transactions = await Transaction.find({
      userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    // Calculate totals
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const emotionalSpendingCount = transactions.filter(
      (t) => t.mood && t.mood !== "neutral"
    ).length;
    
    // Find top trigger (simple frequency count)
    const triggerCounts: Record<string, number> = {};
    transactions.forEach(t => {
        if (t.trigger) {
            triggerCounts[t.trigger] = (triggerCounts[t.trigger] || 0) + 1;
        }
    });
    
    let topTrigger: string | undefined = undefined;
    if (Object.keys(triggerCounts).length > 0) {
        topTrigger = Object.keys(triggerCounts).reduce((a, b) => triggerCounts[a] > triggerCounts[b] ? a : b);
    }
    
    // Simple budget calculation (e.g. monthly income / 30 or default $100)
    // In production this should be a user setting or environment variable
    const dailyBudget = user.profile.monthlyIncome ? (user.profile.monthlyIncome / 30) : 100;

    const summary = {
      date: startOfDay.toISOString(),
      totalSpent,
      budgetLimit: Math.round(dailyBudget),
      emotionalSpendingCount,
      topTrigger,
      savingsProgress: 0, // Placeholder for actual savings logic
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
    await Transaction.deleteMany({ userId }); // Changed MealLog to Transaction

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  }
);

export default {
  getProfile,
  updateProfile,
  getSpendingSummary,
  deleteAccount,
};
