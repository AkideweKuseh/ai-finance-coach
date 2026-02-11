import client from "./client";
import { Transaction, CreateTransactionData } from "../types/transaction";

export const getTransactions = async (date?: string) => {
  const params: any = {};
  if (date) params.date = date;
  
  const response = await client.get("/transactions", { params });
  return response.data;
};

export const getTransactionById = async (id: string) => {
  const response = await client.get(`/transactions/${id}`);
  return response.data;
};

export const logTransaction = async (data: CreateTransactionData) => {
  const response = await client.post("/transactions/log", data);
  return response.data;
};

export const deleteTransaction = async (id: string) => {
  const response = await client.delete(`/transactions/${id}`);
  return response.data;
};

export default {
  getTransactions,
  getTransactionById,
  logTransaction,
  deleteTransaction,
};
