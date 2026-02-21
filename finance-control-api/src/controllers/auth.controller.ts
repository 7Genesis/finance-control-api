import { Request, Response } from "express";
import { registerService, loginService } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const result = await registerService(req.body);
    return res.status(201).json(result);
  } catch (error: any) {
    console.log("ERRO COMPLETO:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Erro sem mensagem",
      raw: error,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await loginService(req.body);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};