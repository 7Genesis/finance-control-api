import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app";
import { connection } from "../src/database";
import { resetDatabase, closeDatabase } from "./helpers/db";

const usuario = { name: "Ana", email: "ana@exemplo.com", password: "senha123" };

beforeEach(resetDatabase);
afterAll(closeDatabase);

describe("POST /auth/register", () => {
  it("cria o usuário e guarda a senha com hash", async () => {
    const res = await request(app).post("/auth/register").send(usuario);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ message: "Usuário criado com sucesso" });
    expect(res.body.id).toEqual(expect.any(Number));

    const { rows } = await connection.query("SELECT password FROM users WHERE email = $1", [usuario.email]);
    expect(rows).toHaveLength(1);
    expect(rows[0].password).not.toBe(usuario.password);
    expect(rows[0].password).toMatch(/^\$2[aby]\$/);
  });

  it("recusa e-mail já cadastrado", async () => {
    await request(app).post("/auth/register").send(usuario);
    const res = await request(app).post("/auth/register").send(usuario);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Email já cadastrado");

    const { rows } = await connection.query("SELECT id FROM users");
    expect(rows).toHaveLength(1);
  });

  it.each([
    ["e-mail inválido", { ...usuario, email: "nao-e-email" }, "Email inválido"],
    ["senha curta", { ...usuario, password: "123" }, "Senha deve ter no mínimo 6 caracteres"],
    ["nome curto", { ...usuario, name: "A" }, "Nome é obrigatório"],
  ])("valida o corpo: %s", async (_caso, body, mensagem) => {
    const res = await request(app).post("/auth/register").send(body);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(mensagem);

    const { rows } = await connection.query("SELECT id FROM users");
    expect(rows).toHaveLength(0);
  });
});

describe("POST /auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/auth/register").send(usuario);
  });

  it("devolve um JWT com o id do usuário", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: usuario.email, password: usuario.password });

    expect(res.status).toBe(200);
    const payload = jwt.verify(res.body.token, process.env.JWT_SECRET as string) as { userId: number };
    const { rows } = await connection.query("SELECT id FROM users WHERE email = $1", [usuario.email]);
    expect(payload.userId).toBe(rows[0].id);
  });

  it("recusa senha errada", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: usuario.email, password: "outra-senha" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Credenciais inválidas");
    expect(res.body.token).toBeUndefined();
  });

  it("recusa e-mail que não existe", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "ninguem@exemplo.com", password: "senha123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Credenciais inválidas");
  });

  it("valida o corpo da requisição", async () => {
    const res = await request(app).post("/auth/login").send({ email: "x" });

    expect(res.status).toBe(400);
  });
});

describe("autenticação das rotas protegidas", () => {
  it("rejeita requisição sem token", async () => {
    const res = await request(app).get("/transactions");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Token não fornecido");
  });

  it("rejeita token inválido", async () => {
    const res = await request(app).get("/transactions").set("Authorization", "Bearer token-falso");

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Token inválido");
  });

  it("rejeita token assinado com outro segredo", async () => {
    const token = jwt.sign({ userId: 1 }, "outro-segredo");
    const res = await request(app).get("/transactions").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(401);
  });
});
