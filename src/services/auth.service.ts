import { connection } from "../database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "supersecret"; // depois colocamos .env

export const registerService = async (data: any) => {
  const { name, email, password } = data;

  const [existing]: any = await connection.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (existing.length > 0) {
    throw new Error("Email já cadastrado");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result]: any = await connection.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $1, $1)",
    [name, email, hashedPassword]
  );

  return {
    message: "Usuário criado com sucesso",
    id: result.insertId,
  };
};

export const loginService = async (data: any) => {
  const { email, password } = data;

  const [rows]: any = await connection.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (rows.length === 0) {
    throw new Error("Credenciais inválidas");
  }

  const user = rows[0];

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("Credenciais inválidas");
  }

  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token };
};