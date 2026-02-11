/**
 * User Model - MongoDB Schema
 *
 * Defines user data structure and profile information
 */

import mongoose, { Schema, Document } from "mongoose";

export interface IUserProfile {
  age: number;
  monthlyIncome: number;
  riskTolerance: "conservative" | "moderate" | "aggressive";
  primaryGoal: "save_emergency" | "pay_debt" | "invest" | "budget_control";
  spendingCategories: string[];
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
  monthlyIncome: { type: Number, required: true, min: 0 },
  riskTolerance: {
    type: String,
    required: true,
    enum: ["conservative", "moderate", "aggressive"],
    default: "moderate",
  },
  primaryGoal: {
    type: String,
    required: true,
    enum: ["save_emergency", "pay_debt", "invest", "budget_control"],
    default: "budget_control",
  },
  spendingCategories: [{ type: String }],
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
