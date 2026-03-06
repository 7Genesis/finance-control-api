import { Response } from "express";
import logger from "../utils/logger";

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
  try {
    const result = await createTransactionService(
      req.body,
      String(req.user!.userId)
    );

    logger.info(`Transaction created by user ${req.user!.userId}`);

    return res.status(201).json(result);
  } catch (error: any) {
    logger.error(`Error creating transaction: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Error creating transaction",
    });
  }
};

/* LIST */
export const getTransactions = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getTransactionsService(
      String(req.user!.userId),
      { page, limit }
    );

    logger.info(`Transactions fetched for user ${req.user!.userId}`);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    logger.error(`Error fetching transactions: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Error fetching transactions",
    });
  }
};

/* UPDATE */
export const updateTransaction = async (
  req: AuthRequest<{ id: string }, any, TransactionDTO>,
  res: Response
) => {
  try {
    const result = await updateTransactionService(
      req.params.id,
      String(req.user!.userId),
      req.body
    );

    logger.info(
      `Transaction ${req.params.id} updated by user ${req.user!.userId}`
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error(`Error updating transaction: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Error updating transaction",
    });
  }
};

/* DELETE */
export const deleteTransaction = async (
  req: AuthRequest<{ id: string }>,
  res: Response
) => {
  try {
    const result = await deleteTransactionService(
      req.params.id,
      String(req.user!.userId)
    );

    logger.info(
      `Transaction ${req.params.id} deleted by user ${req.user!.userId}`
    );

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error(`Error deleting transaction: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Error deleting transaction",
    });
  }
};

/* BALANCE */
export const getBalance = async (req: AuthRequest, res: Response) => {
  try {
    const result = await getBalanceService(
      String(req.user!.userId)
    );

    logger.info(`Balance fetched for user ${req.user!.userId}`);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error(`Error fetching balance: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Error fetching balance",
    });
  }
};

/* MONTHLY */
export const getMonthlySummary = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const result = await getMonthlySummaryService(
      String(req.user!.userId)
    );

    logger.info(`Monthly summary fetched for user ${req.user!.userId}`);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    logger.error(`Error fetching monthly summary: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Error fetching monthly summary",
    });
  }
};

/* DASHBOARD */
export const getDashboard = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = String(req.user!.userId);

    const [balance, monthly] = await Promise.all([
      getBalanceService(userId),
      getMonthlySummaryService(userId),
    ]);

    logger.info(`Dashboard fetched for user ${userId}`);

    return res.json({
      success: true,
      data: {
        balance,
        monthly,
      },
    });
  } catch (error: any) {
    logger.error(`Error fetching dashboard: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Error fetching dashboard",
    });
  }
};