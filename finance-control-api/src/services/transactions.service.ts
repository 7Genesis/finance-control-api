import { connection } from "../database";
import { TransactionDTO } from "../types/transaction.types";
import { AppError } from "../utils/AppError";

/* ===================================================
   CREATE
=================================================== */
export const createTransactionService = async (
  data: TransactionDTO,
  userId: string
) => {
  const { title, amount, type } = data;

  const result = await connection.query(
    `
    INSERT INTO transactions (title, amount, type, user_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id
    `,
    [title, amount, type, userId]
  );

  return {
    message: "Transação criada com sucesso",
    id: result.rows[0].id,
  };
};

/* ===================================================
   LIST ALL
=================================================== */
export const getTransactionsService = async (
  userId: string,
  { page, limit }: { page: number; limit: number }
) => {
  const safePage = Number(page) || 1;
  const safeLimit = Number(limit) || 10;
  const offset = (safePage - 1) * safeLimit;

  const result = await connection.query(
    `
    SELECT * FROM transactions
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
    `,
    [userId, safeLimit, offset]
  );

  const countResult = await connection.query(
    `SELECT COUNT(*) FROM transactions WHERE user_id = $1`,
    [userId]
  );

  const total = Number(countResult.rows[0].count);
  const pages = Math.ceil(total / safeLimit);

  const formattedTransactions = result.rows.map((transaction: any) => ({
    ...transaction,
    amount: Number(transaction.amount),
  }));

  return {
    data: formattedTransactions,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      pages,
    },
  };
};
/* ===================================================
   UPDATE
=================================================== */
export const updateTransactionService = async (
  id: string,
  userId: string,
  data: {
    title?: string;
    amount?: number;
    type?: "income" | "expense";
  }
) => {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.title !== undefined) {
    values.push(data.title);
    fields.push(`title = $${values.length}`);
  }

  if (data.amount !== undefined) {
    values.push(Number(data.amount));
    fields.push(`amount = $${values.length}`);
  }

  if (data.type !== undefined) {
    values.push(data.type);
    fields.push(`type = $${values.length}`);
  }

  if (fields.length === 0) {
    throw new AppError("Nenhum campo para atualizar", 400);
  }

  values.push(id);
  values.push(userId);

  const result = await connection.query(
    `
      UPDATE transactions
      SET ${fields.join(", ")}
      WHERE id = $${values.length - 1}
      AND user_id = $${values.length}
    `,
    values
  );

  if (result.rowCount === 0) {
    throw new AppError("Transação não encontrada", 404);
  }

  return { message: "Transação atualizada com sucesso" };
};

/* ===================================================
   DELETE
=================================================== */
export const deleteTransactionService = async (
  id: string,
  userId: string
) => {
  const result = await connection.query(
    "DELETE FROM transactions WHERE id = $1 AND user_id = $2",
    [id, userId]
  );

  if (result.rowCount === 0) {
    throw new AppError("Transação não encontrada", 404);
  }

  return { message: "Transação deletada com sucesso" };
};

/* ===================================================
   BALANCE
=================================================== */
export const getBalanceService = async (userId: string) => {
  const result = await connection.query(
    `
    SELECT
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
    FROM transactions
    WHERE user_id = $1
    `,
    [userId]
  );

  const income = Number(result.rows[0].income) || 0;
  const expense = Number(result.rows[0].expense) || 0;

  return {
    income,
    expense,
    balance: income - expense,
  };
};

/* ===================================================
   MONTHLY SUMMARY
=================================================== */
export const getMonthlySummaryService = async (userId: string) => {
  const result = await connection.query(
    `
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') as month_label,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
      FROM transactions
      WHERE user_id = $1
      GROUP BY month_label
      ORDER BY month_label
      `,
    [userId]
  );

  return result.rows.map((row: any) => {
    const income = Number(row.total_income) || 0;
    const expense = Number(row.total_expense) || 0;

    return {
      month: row.month_label,
      income,
      expense,
      balance: income - expense,
    };
  });
};