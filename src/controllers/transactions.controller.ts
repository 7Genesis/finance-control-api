import { Request, Response } from "express";
import { TransactionDTO } from "../types/transaction.types";
import {
  createTransactionService,
  getTransactionsService,
  updateTransactionService,
  deleteTransactionService,
  getMonthlySummaryService, 
  getSummaryService,
  getBalanceService
} from "../services/transactions.service";

import { AuthRequest } from "../middlewares/auth.middleware";

export const createTransaction = async (
  req: AuthRequest,
  res: Response
) => {
  const result = await createTransactionService(
    req.body,
    req.user!.userId
  );

  return res.status(201).json(result);
};

export const getTransactions = async (
  req: AuthRequest,
  res: Response
) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await getTransactionsService(
    req.user!.userId,
    {
      page,
      limit,
      type: req.query.type as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
      sort: req.query.sort as string,
      order: req.query.order as string,
    }
  );

  return res.json({
    success: true,
    ...result,
  });
};

export const updateTransaction = async (
  req: AuthRequest<{ id: string }, any, TransactionDTO>,
  res: Response
) => {
  const result = await updateTransactionService(
    req.params.id,
    req.body,
    req.user!.userId
  );

  return res.json({
    success: true,
    data: result
  });
};

export const deleteTransaction = async (
  req: AuthRequest<{ id: string }>,
  res: Response
) => {
  const result = await deleteTransactionService(req.params.id, req.user!.userId);

  return res.json({
    success: true,
    data: result
  });
};

export const getBalance = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  const result = await getBalanceService(userId);

  return res.json({
    success: true,
    data: result,
  });
};

export const getSummary = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { startDate, endDate } = req.query;

  const summary = await getSummaryService(
    userId,
    startDate as string,
    endDate as string
  );

  return res.json({
    success: true,
    data: summary,
  });
};

export const getMonthlySummary = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;

    const result = await getMonthlySummaryService(userId);

      return res.json({
        success: true,
        date: result,
    });
};

export const getDashboard = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  const [balance, summary, monthly] = await Promise.all([
    getBalanceService(userId),
    getSummaryService(userId),
    getMonthlySummaryService(userId),
  ]);

  return res.json({
    success: true,
    data: {
      balance,
      summary,
      monthly,
    },
  });
};