import { Request, Response } from "express";
import { registerService, loginService } from "../services/auth.service";
import { AppError } from "../utils/AppError";
import logger from "../utils/logger";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await registerService(req.body);
    return res.status(201).json(result);
  } catch (error: any) {
    logger.error(`Error registering user: ${error.message}`);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body);
    return res.json(result);
  } catch (error: any) {
    logger.error(`Error logging in: ${error.message}`);

    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};