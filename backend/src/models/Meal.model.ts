/**
 * Meal Model - MongoDB Schema
 *
 * Defines meal/recipe data structure and user meal logs
 */

import mongoose, { Schema, Document } from "mongoose";

export interface IMacros {
  protein: number;
  carbs: number;
  fat: number;
}

export interface IIngredient {
  name: string;
  amount: string;
  unit?: string;
  grams?: number;
}

export interface IPreparationStep {
  stepNumber: number;
  instruction: string;
  duration?: number;
}

export interface IMeal extends Document {
  name: string;
  description: string;
  imageUrl?: string;
  calories: number;
  macros: IMacros;
  ingredients: IIngredient[];
  instructions: IPreparationStep[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  mealType: string[];
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMealLog extends Document {
  userId: mongoose.Types.ObjectId;
  mealId: mongoose.Types.ObjectId;
  date: Date;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  servings: number;
  createdAt: Date;
}

const MacrosSchema = new Schema<IMacros>(
  {
    protein: { type: Number, required: true, min: 0 },
    carbs: { type: Number, required: true, min: 0 },
    fat: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const IngredientSchema = new Schema<IIngredient>(
  {
    name: { type: String, required: true },
    amount: { type: String, required: true },
    unit: { type: String },
    grams: { type: Number },
  },
  { _id: false }
);

const PreparationStepSchema = new Schema<IPreparationStep>(
  {
    stepNumber: { type: Number, required: true },
    instruction: { type: String, required: true },
    duration: { type: Number },
  },
  { _id: false }
);

const MealSchema = new Schema<IMeal>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: { type: String },
    calories: {
      type: Number,
      required: true,
      min: 0,
    },
    macros: {
      type: MacrosSchema,
      required: true,
    },
    ingredients: [IngredientSchema],
    instructions: [PreparationStepSchema],
    prepTime: {
      type: Number,
      required: true,
      min: 0,
    },
    cookTime: {
      type: Number,
      required: true,
      min: 0,
    },
    servings: {
      type: Number,
      required: true,
      min: 1,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    tags: [{ type: String }],
    mealType: [
      {
        type: String,
        enum: ["breakfast", "lunch", "dinner", "snack"],
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

const MealLogSchema = new Schema<IMealLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mealId: {
      type: Schema.Types.ObjectId,
      ref: "Meal",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    mealType: {
      type: String,
      required: true,
      enum: ["breakfast", "lunch", "dinner", "snack"],
    },
    servings: {
      type: Number,
      required: true,
      min: 0.1,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
MealSchema.index({ name: "text", description: "text" });
MealSchema.index({ tags: 1 });
MealSchema.index({ mealType: 1 });

MealLogSchema.index({ userId: 1, date: -1 });
MealLogSchema.index({ userId: 1, mealId: 1 });

export const Meal = mongoose.model<IMeal>("Meal", MealSchema);
export const MealLog = mongoose.model<IMealLog>("MealLog", MealLogSchema);

export default { Meal, MealLog };
