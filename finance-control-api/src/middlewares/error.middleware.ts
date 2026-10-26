import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { AppError } from "../utils/AppError";

interface CustomError extends Error {
  statusCode?: number;
}

export const errorMiddleware = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Unhandled error: ${error.message}`);

  const statusCode = error.statusCode || 500;

  // A mensagem original só sai para erros conhecidos (AppError); os demais podem trazer detalhe interno.
  const message =
    error instanceof AppError
      ? error.message
      : statusCode < 500
        ? "Requisição inválida"
        : "Erro interno do servidor";

  return res.status(statusCode).json({
    success: false,
    error: message,
  });
};