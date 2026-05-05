/**
 * Transaction Controller
 *
 * Handles transaction data and logging
 * Updated: Force refresh
 */

import { Response } from "express";
import { Transaction } from "../models/Transaction.model";
import { AuthRequest } from "../middleware/auth.middleware";
import { AppError, catchAsync } from "../middleware/error.middleware";
import { checkAndSendSpendingAlert } from "../services/notification.service";

/**
 * Get all user transactions
 */
export const getTransactions = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const dateParam = req.query.date as string;

  let query: any = { userId };

  if (dateParam) {
    const date = new Date(dateParam);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    query.date = { $gte: startOfDay, $lte: endOfDay };
  }

  const transactions = await Transaction.find(query).sort({ date: -1 });

  res.status(200).json({
    success: true,
    data: transactions,
  });
});

/**
 * Log a transaction
 */
export const logTransaction = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { description, amount, category, mood, trigger, notes, date } = req.body;

  const transaction = await Transaction.create({
    userId,
    description,
    amount,
    category,
    mood,
    trigger,
    notes,
    date: date ? new Date(date) : new Date(),
  });

  res.status(201).json({
    success: true,
    message: "Transaction logged successfully",
    data: transaction,
  });

  const alertUserId = req.user?.userId!;
  Transaction.find({
    userId: alertUserId,
    date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
  }).then((todayTxs) => {
    const todayTotal = todayTxs.reduce((sum, t) => sum + t.amount, 0);
    checkAndSendSpendingAlert(alertUserId, todayTotal).catch(console.error);
  });
});

/**
 * Get transaction by ID
 */
export const getTransactionById = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  const transaction = await Transaction.findOne({ _id: id, userId });

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  res.status(200).json({
    success: true,
    data: transaction,
  });
});

/**
 * Delete transaction
 */
export const deleteTransaction = catchAsync(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { id } = req.params;

  const transaction = await Transaction.findOne({ _id: id, userId });

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  await transaction.deleteOne();

  res.status(200).json({
    success: true,
    message: "Transaction deleted successfully",
  });
});

export default {
    getTransactions,
    logTransaction,
    getTransactionById,
    deleteTransaction
};
