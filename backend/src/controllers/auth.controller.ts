/**
 * Authentication Controller
 *
 * Handles user registration, login, token refresh, and logout
 */

import { Request, Response } from "express";
import { User, IUser } from "../models/User.model";
import { hashPassword, comparePassword } from "../utils/password.util";
import {
  generateTokenPair,
  verifyRefreshToken,
  JWTPayload,
} from "../utils/jwt.util";
import { AppError, catchAsync } from "../middleware/error.middleware";

/**
 * Calculate daily calorie goal and macros based on user profile
 */
const calculateNutritionGoals = (profile: any) => {
  const { age, height, weight, goal, activityLevel } = profile;

  // Calculate BMR using Mifflin-St Jeor Equation (for men, simplified)
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;

  // Activity multipliers
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    athlete: 1.9,
  };

  // Calculate TDEE (Total Daily Energy Expenditure)
  const tdee = bmr * (activityMultipliers[activityLevel] || 1.55);

  // Adjust for goal
  let dailyCalories = tdee;
  if (goal === "lose") {
    dailyCalories = tdee - 500; // 500 calorie deficit
  } else if (goal === "gain") {
    dailyCalories = tdee + 300; // 300 calorie surplus
  }

  // Calculate macros (40% carbs, 30% protein, 30% fat)
  const protein = Math.round((dailyCalories * 0.3) / 4); // 4 cal per gram
  const carbs = Math.round((dailyCalories * 0.4) / 4);
  const fat = Math.round((dailyCalories * 0.3) / 9); // 9 cal per gram

  return {
    dailyCalorieGoal: Math.round(dailyCalories),
    macroGoals: { protein, carbs, fat },
  };
};

/**
 * Register new user
 */
export const register = catchAsync(async (req: Request, res: Response) => {
  const { email, password, name, profile } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  // Normalize profile (UI may not collect full profile at signup)
  const normalizedProfile = {
    age: profile?.age ?? 30,
    height: profile?.height ?? 170,
    weight: profile?.weight ?? 70,
    goal: profile?.goal ?? "maintain",
    activityLevel: profile?.activityLevel ?? "moderate",
    dietaryPreferences: profile?.dietaryPreferences || [],
    unitPreference: profile?.unitPreference || "metric",
  };

  // Calculate nutrition goals
  const nutritionGoals = calculateNutritionGoals(normalizedProfile);

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
    name,
    profile: {
      ...normalizedProfile,
      ...nutritionGoals,
    },
  });

  // Generate tokens
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
  };

  const { accessToken, refreshToken } = generateTokenPair(payload);

  // Store refresh token
  user.refreshTokens = [refreshToken];
  await user.save();

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    },
  });
});

/**
 * Login user
 */
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user (include password for verification)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  // Generate tokens
  const payload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
  };

  const { accessToken, refreshToken } = generateTokenPair(payload);

  // Add refresh token to user's tokens
  user.refreshTokens.push(refreshToken);

  // Limit stored refresh tokens to last 5
  if (user.refreshTokens.length > 5) {
    user.refreshTokens = user.refreshTokens.slice(-5);
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    },
  });
});

/**
 * Refresh access token
 */
export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError("Refresh token required", 400);
  }

  // Verify refresh token
  let payload: JWTPayload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (_error) {
    throw new AppError("Invalid refresh token", 401);
  }

  // Find user and check if refresh token exists
  const user = await User.findById(payload.userId);

  if (!user || !user.refreshTokens.includes(refreshToken)) {
    throw new AppError("Invalid refresh token", 401);
  }

  // Generate new tokens
  const newPayload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
  };

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    generateTokenPair(newPayload);

  // Replace old refresh token with new one
  user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
  user.refreshTokens.push(newRefreshToken);

  await user.save();

  res.status(200).json({
    success: true,
    data: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    },
  });
});

/**
 * Logout (invalidate refresh token)
 */
export const logout = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const userId = (req as any).user?.userId;

  if (userId && refreshToken) {
    const user = await User.findById(userId);

    if (user) {
      user.refreshTokens = user.refreshTokens.filter(
        (t: string) => t !== refreshToken
      );
      await user.save();
    }
  }

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

export default {
  register,
  login,
  refreshToken,
  logout,
};
