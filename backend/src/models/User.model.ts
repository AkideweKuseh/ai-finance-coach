/**
 * User Model - MongoDB Schema
 *
 * Defines user data structure and profile information
 */

import mongoose, { Schema, Document } from "mongoose";

export interface IUserProfile {
  age: number;
  height: number; // cm
  weight: number; // kg
  goal: "lose" | "maintain" | "gain";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "athlete";
  dietaryPreferences: string[];
  dailyCalorieGoal: number;
  macroGoals: {
    protein: number;
    carbs: number;
    fat: number;
  };
  unitPreference: "metric" | "imperial";
}

export interface IUser extends Document {
  email: string;
  password: string; // Hashed
  name: string;
  profile: IUserProfile;
  refreshTokens: string[]; // Store active refresh tokens
  createdAt: Date;
  updatedAt: Date;
}

const UserProfileSchema = new Schema<IUserProfile>({
  age: { type: Number, required: true, min: 13, max: 120 },
  height: { type: Number, required: true, min: 100, max: 300 },
  weight: { type: Number, required: true, min: 30, max: 300 },
  goal: {
    type: String,
    required: true,
    enum: ["lose", "maintain", "gain"],
    default: "maintain",
  },
  activityLevel: {
    type: String,
    required: true,
    enum: ["sedentary", "light", "moderate", "active", "athlete"],
    default: "moderate",
  },
  dietaryPreferences: [{ type: String }],
  dailyCalorieGoal: { type: Number, required: true, min: 1000, max: 5000 },
  macroGoals: {
    protein: { type: Number, required: true, min: 0 },
    carbs: { type: Number, required: true, min: 0 },
    fat: { type: Number, required: true, min: 0 },
  },
  unitPreference: {
    type: String,
    enum: ["metric", "imperial"],
    default: "metric",
  },
});

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    profile: {
      type: UserProfileSchema,
      required: true,
    },
    refreshTokens: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

// Don't return password and refresh tokens in queries by default
UserSchema.set("toJSON", {
  transform: function (_doc: any, ret: any) {
    delete ret.password;
    delete ret.refreshTokens;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model<IUser>("User", UserSchema);

export default User;
