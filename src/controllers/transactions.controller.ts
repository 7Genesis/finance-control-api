import { Response } from "express";
import { TransactionDTO } from "../types/transaction.types";
import {
  createTransactionService,
  getTransactionsService,
  updateTransactionService,
  deleteTransactionService,
  getMonthlySummaryService,
  getBalanceService
} from "../services/transactions.service";

import { AuthRequest } from "../middlewares/auth.middleware";

/* CREATE */
export const createTransaction = async (
  req: AuthRequest,
  res: Response
) => {
  const result = await createTransactionService(
    req.body,
    String(req.user!.userId)
  );

  return res.status(201).json(result);
};

/* LIST */
export const getTransactions = async (
  req: AuthRequest,
  res: Response
) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await getTransactionsService(
    String(req.user!.userId),
    { page, limit }
  );

  return res.json({
    success: true,
    ...result,
  });
};

/* UPDATE */
export const updateTransaction = async (
  req: AuthRequest<{ id: string }, any, TransactionDTO>,
  res: Response
) => {
  const result = await updateTransactionService(
    req.params.id,
    String(req.user!.userId),
    req.body
  );

  return res.json({
    success: true,
    data: result,
  });
};

/* DELETE */
export const deleteTransaction = async (
  req: AuthRequest<{ id: string }>,
  res: Response
) => {
  const result = await deleteTransactionService(
    req.params.id,
    String(req.user!.userId)
  );

  return res.json({
    success: true,
    data: result,
  });
};

/* BALANCE */
export const getBalance = async (req: AuthRequest, res: Response) => {
  const result = await getBalanceService(
    String(req.user!.userId)
  );

  return res.json({
    success: true,
    data: result,
  });
};

/* MONTHLY */
export const getMonthlySummary = async (
  req: AuthRequest,
  res: Response
) => {
  const result = await getMonthlySummaryService(
    String(req.user!.userId)
  );

  return res.json({
    success: true,
    data: result,
  });
};

/* DASHBOARD */
export const getDashboard = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = String(req.user!.userId);

  const [balance, monthly] = await Promise.all([
    getBalanceService(userId),
    getMonthlySummaryService(userId),
  ]);

  return res.json({
    success: true,
    data: {
      balance,
      monthly,
    },
  });
};