import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";

import {
  createTransactionSchema,
  updateTransactionSchema,
} from "../schemas/transaction.schema";

import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getBalance,
  getSummary,
  getMonthlySummary,
  getDashboard,
} from "../controllers/transactions.controller";

const router = Router();

/* ===================================================
   PROTECTED ROUTES
=================================================== */

router.use(authenticate);

/* CREATE */
router.post(
  "/",
  validate(createTransactionSchema),
  createTransaction
);

/* LIST */
router.get("/", getTransactions);

/* BALANCE */
router.get("/balance", getBalance);

/* SUMMARY */
router.get("/summary", getSummary);

/* MONTHLY */
router.get("/monthly", getMonthlySummary);

/* DASHBOARD */
router.get("/dashboard", getDashboard);

/* UPDATE */
router.put(
  "/:id",
  validate(updateTransactionSchema),
  updateTransaction
);

/* DELETE */
router.delete("/:id", deleteTransaction);

export default router;