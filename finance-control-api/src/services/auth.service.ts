import { connection } from "../database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não definido no .env");
}

const JWT_SECRET = process.env.JWT_SECRET;

export const registerService = async (data: any) => {
  const { name, email, password } = data;

  const checkUser = await connection.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (checkUser.rows.length > 0) {
    throw new AppError("Email já cadastrado", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const insertUser = await connection.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
    [name, email, hashedPassword]
  );

  return {
    message: "Usuário criado com sucesso",
    id: insertUser.rows[0].id,
  };
};

export const loginService = async (data: any) => {
  const { email, password } = data;

  const result = await connection.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    throw new AppError("Credenciais inválidas", 400);
  }

  const user = result.rows[0];

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new AppError("Credenciais inválidas", 400);
  }

  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token };
};