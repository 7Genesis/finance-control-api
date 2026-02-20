import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
}

export const errorMiddleware = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🔥 ERROR:", error);

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    error: error.message || "Erro interno do servidor",
  });
};