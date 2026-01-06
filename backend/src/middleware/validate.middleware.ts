/**
 * Validation Middleware
 *
 * Request validation using express-validator
 */

import { Request, Response, NextFunction } from "express";
import { validationResult, body } from "express-validator";

/**
 * Handle validation errors
 */
export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
    return;
  }

  next();
};

/**
 * User registration validation rules
 */
export const registerValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("profile.age")
    .optional()
    .isInt({ min: 13, max: 120 })
    .withMessage("Age must be between 13 and 120"),
  body("profile.height")
    .optional()
    .isFloat({ min: 100, max: 300 })
    .withMessage("Height must be between 100 and 300 cm"),
  body("profile.weight")
    .optional()
    .isFloat({ min: 30, max: 300 })
    .withMessage("Weight must be between 30 and 300 kg"),
  body("profile.goal")
    .optional()
    .isIn(["lose", "maintain", "gain"])
    .withMessage("Goal must be lose, maintain, or gain"),
  body("profile.activityLevel")
    .optional()
    .isIn(["sedentary", "light", "moderate", "active", "athlete"])
    .withMessage("Invalid activity level"),
];

/**
 * User login validation rules
 */
export const loginValidation = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

/**
 * Chat message validation rules
 */
export const chatMessageValidation = [
  body("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Message must be between 1 and 1000 characters"),
];

/**
 * Meal log validation rules
 */
export const mealLogValidation = [
  body("mealId").isMongoId().withMessage("Invalid meal ID"),
  body("date").isISO8601().withMessage("Invalid date format"),
  body("mealType")
    .isIn(["breakfast", "lunch", "dinner", "snack"])
    .withMessage("Invalid meal type"),
  body("servings")
    .isFloat({ min: 0.1, max: 10 })
    .withMessage("Servings must be between 0.1 and 10"),
];

export default {
  validate,
  registerValidation,
  loginValidation,
  chatMessageValidation,
  mealLogValidation,
};
