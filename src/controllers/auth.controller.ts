import { Request, Response } from "express";
import { registerService, loginService } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  const result = await registerService(req.body);
  return res.status(201).json(result);
};

export const login = async (req: Request, res: Response) => {
  const result = await loginService(req.body);
  return res.json(result);
};