import request from "supertest";
import app from "../../src/app";

export const registerAndLogin = async (
  email = "ana@exemplo.com",
  password = "senha123",
  name = "Ana"
) => {
  await request(app).post("/auth/register").send({ name, email, password });
  const res = await request(app).post("/auth/login").send({ email, password });
  return res.body.token as string;
};
