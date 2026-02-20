import { connection } from "../database";
import { TransactionDTO} from "../types/transaction.types";
import { AppError } from "../utils/AppError";
import { ResultSetHeader } from "mysql2";

/* ===================================================
   CREATE
=================================================== */
export const createTransactionService = async (
  data: TransactionDTO,
  userId: number
) => {
  const { title, amount, type } = data;

  const [result]: any = await connection.execute(
    `
    INSERT INTO transactions (title, amount, type, user_id)
    VALUES (?, ?, ?, ?)
    `,
    [title, amount, type, userId]
  );

  return {
    message: "Transação criada com sucesso",
    id: result.insertId,
  };
};
/* ===================================================
   LIST ALL
=================================================== */
interface GetTransactionsParams {
  page: number;
  limit: number;
  type?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
  order?: string;
}

export const getTransactionsService = async (
  userId: number,
  {
    page,
    limit,
    type,
    startDate,
    endDate,
    sort = "created_at",
    order = "desc",
  }: GetTransactionsParams
) => {
  const safePage = Number(page) || 1;
  const safeLimit = Number(limit) || 10;
  const offset = (safePage - 1) * safeLimit;

  const allowedSortFields = ["id", "title", "amount", "type", "created_at"];
  const safeSort = allowedSortFields.includes(sort) ? sort : "created_at";
  const safeOrder = order.toLowerCase() === "asc" ? "ASC" : "DESC";

 let whereClause = "WHERE user_id = ?";
const values: any[] = [userId];

  if (type && ["income", "expense"].includes(type)) {
    whereClause += " AND type = ?";
    values.push(type);
  }

  if (startDate) {
    whereClause += " AND created_at >= ?";
    values.push(startDate);
  }

  if (endDate) {
    whereClause += " AND created_at <= ?";
    values.push(endDate);
  }

  const [rows]: any = await connection.execute(
    `
    SELECT * FROM transactions
    ${whereClause}
    ORDER BY ${safeSort} ${safeOrder}
    LIMIT ${safeLimit} OFFSET ${offset}
    `,
    values
  );

  const [countResult]: any = await connection.execute(
    `
    SELECT COUNT(*) as total FROM transactions
    ${whereClause}
    `,
    values
  );

  const total = countResult[0].total;
  const pages = Math.ceil(total / safeLimit);

  return {
    data: rows.map((row: any) => ({
      ...row,
      amount: Number(row.amount),
    })),
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
  data: any,
  userId: number
) => {
  const fields: string[] = [];
  const values: any[] = [];

  if (data.title !== undefined) {
    fields.push("title = ?");
    values.push(data.title);
  }

  if (data.amount !== undefined) {
    fields.push("amount = ?");
    values.push(Number(data.amount));
  }

  if (data.type !== undefined) {
    fields.push("type = ?");
    values.push(data.type);
  }

  values.push(id, userId);

const [result] = await connection.execute<ResultSetHeader>(
  `
  UPDATE transactions
  SET ${fields.join(", ")}
  WHERE id = ? AND user_id = ?
  `,
  values
);


if (result.affectedRows === 0) {
  throw new AppError("Transação não encontrada", 404);
}

  return { message: "Transação atualizada com sucesso" };
};
/* ===================================================
   DELETE
=================================================== */
export const deleteTransactionService = async (
  id: string,
  userId: number
) => {
  const [result] = await connection.execute<ResultSetHeader>(
    "DELETE FROM transactions WHERE id = ? AND user_id = ?",
    [id, userId]
  );

  if (result.affectedRows === 0) {
    throw new AppError("Transação não encontrada", 404);
  }

  return { message: "Transação deletada com sucesso" };
};
/* ===================================================
   BALANCE
=================================================== */

export const getBalanceService = async (userId: number) => {
  const [rows]: any = await connection.execute(
    `
    SELECT
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense
    FROM transactions
    WHERE user_id = ?
    `,
    [userId]
  );

  const income = Number(rows[0].income) || 0;
  const expense = Number(rows[0].expense) || 0;

  return {
    income,
    expense,
    balance: income - expense,
  };
};
/* ===================================================
   SUMARY
=================================================== */
export const getSummaryService = async (
    userId: number,
    startDate?: string,
    endDate?: string
) => {
  let query =
    `
    SELECT 
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as totalIncome,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as totalExpense
    FROM transactions
    WHERE user_id = ?
    `;
    const params : any[] = [userId];

    if (startDate && endDate) {
        query += ` AND created_at BETWEEN ? AND ?`;
        params.push(startDate, endDate);
    }

    const [rows]: any = await connection.execute(query, params);

  const totalIncome = Number(rows[0].totalIncome) || 0;
  const totalExpense = Number(rows[0].totalExpense) || 0;

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};
 
export const getMonthlySummaryService = async (userId: number) => {
  try {
    const [rows]: any = await connection.execute(
      `
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month_label,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
      FROM transactions
      WHERE user_id = ?
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY DATE_FORMAT(created_at, '%Y-%m')
      `,
      [userId]
    );

    console.log("Monthly rows:", rows);

    return rows.map((row: any) => {
      const income = Number(row.total_income) || 0;
      const expense = Number(row.total_expense) || 0;

      return {
        month: row.month_label,
        income,
        expense,
        balance: income - expense,
      };
    });

  } catch (error) {
    console.error("Monthly summary error:", error);
    throw error;
  }
};
