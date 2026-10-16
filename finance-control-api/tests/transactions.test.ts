import request from "supertest";
import app from "../src/app";
import { connection } from "../src/database";
import { resetDatabase, closeDatabase } from "./helpers/db";
import { registerAndLogin } from "./helpers/auth";

const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

const criar = async (token: string, body: object) =>
  request(app).post("/transactions").set(bearer(token)).send(body);

let token: string;

beforeEach(async () => {
  await resetDatabase();
  token = await registerAndLogin();
});
afterAll(closeDatabase);

describe("POST /transactions", () => {
  it("cria uma receita e grava o valor no banco", async () => {
    const res = await criar(token, { title: "Salário", amount: 5000.5, type: "income" });

    expect(res.status).toBe(201);
    expect(res.body.id).toEqual(expect.any(Number));

    const { rows } = await connection.query("SELECT title, amount, type FROM transactions WHERE id = $1", [res.body.id]);
    expect(rows[0]).toEqual({ title: "Salário", amount: "5000.50", type: "income" });
  });

  it("aceita o valor como texto numérico", async () => {
    const res = await criar(token, { title: "Mercado", amount: "89.90", type: "expense" });

    expect(res.status).toBe(201);
  });

  it.each([
    ["valor zero", { title: "x", amount: 0, type: "income" }],
    ["valor negativo", { title: "x", amount: -10, type: "expense" }],
    ["tipo desconhecido", { title: "x", amount: 10, type: "transferencia" }],
    ["título vazio", { title: "", amount: 10, type: "income" }],
  ])("rejeita %s", async (_caso, body) => {
    const res = await criar(token, body);

    expect(res.status).toBe(400);
    const { rows } = await connection.query("SELECT id FROM transactions");
    expect(rows).toHaveLength(0);
  });
});

describe("GET /transactions", () => {
  it("lista com paginação e devolve amount como número", async () => {
    for (let i = 1; i <= 5; i++) {
      await criar(token, { title: `Item ${i}`, amount: i * 10, type: "expense" });
    }

    const res = await request(app).get("/transactions?page=2&limit=2").set(bearer(token));

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.meta).toEqual({ page: 2, limit: 2, total: 5, pages: 3 });
    expect(res.body.data).toHaveLength(2);
    expect(typeof res.body.data[0].amount).toBe("number");
  });

  it("não mostra transações de outro usuário", async () => {
    await criar(token, { title: "Minha", amount: 10, type: "income" });
    const outro = await registerAndLogin("bia@exemplo.com", "senha123", "Bia");
    await criar(outro, { title: "Da Bia", amount: 99, type: "income" });

    const res = await request(app).get("/transactions").set(bearer(token));

    expect(res.body.meta.total).toBe(1);
    expect(res.body.data.map((t: { title: string }) => t.title)).toEqual(["Minha"]);
  });
});

describe("PUT /transactions/:id", () => {
  it("atualiza só os campos enviados", async () => {
    const { body } = await criar(token, { title: "Luz", amount: 100, type: "expense" });

    const res = await request(app).put(`/transactions/${body.id}`).set(bearer(token)).send({ amount: 120 });

    expect(res.status).toBe(200);
    const { rows } = await connection.query("SELECT title, amount, type FROM transactions WHERE id = $1", [body.id]);
    expect(rows[0]).toEqual({ title: "Luz", amount: "120.00", type: "expense" });
  });

  it("rejeita corpo vazio", async () => {
    const { body } = await criar(token, { title: "Luz", amount: 100, type: "expense" });

    const res = await request(app).put(`/transactions/${body.id}`).set(bearer(token)).send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Envie pelo menos um campo para atualizar");
  });

  it("não altera transação de outro usuário", async () => {
    const outro = await registerAndLogin("bia@exemplo.com", "senha123", "Bia");
    const { body } = await criar(outro, { title: "Da Bia", amount: 50, type: "income" });

    const res = await request(app).put(`/transactions/${body.id}`).set(bearer(token)).send({ title: "Invadida" });

    expect(res.status).toBeGreaterThanOrEqual(400);
    const { rows } = await connection.query("SELECT title FROM transactions WHERE id = $1", [body.id]);
    expect(rows[0].title).toBe("Da Bia");
  });
});

describe("DELETE /transactions/:id", () => {
  it("apaga a transação", async () => {
    const { body } = await criar(token, { title: "Cinema", amount: 40, type: "expense" });

    const res = await request(app).delete(`/transactions/${body.id}`).set(bearer(token));

    expect(res.status).toBe(200);
    const { rows } = await connection.query("SELECT id FROM transactions WHERE id = $1", [body.id]);
    expect(rows).toHaveLength(0);
  });

  it("não apaga transação de outro usuário", async () => {
    const outro = await registerAndLogin("bia@exemplo.com", "senha123", "Bia");
    const { body } = await criar(outro, { title: "Da Bia", amount: 50, type: "income" });

    const res = await request(app).delete(`/transactions/${body.id}`).set(bearer(token));

    expect(res.status).toBeGreaterThanOrEqual(400);
    const { rows } = await connection.query("SELECT id FROM transactions WHERE id = $1", [body.id]);
    expect(rows).toHaveLength(1);
  });
});

describe("saldo e resumos", () => {
  beforeEach(async () => {
    await criar(token, { title: "Salário", amount: 3000, type: "income" });
    await criar(token, { title: "Aluguel", amount: 1200.25, type: "expense" });
    await criar(token, { title: "Mercado", amount: 300, type: "expense" });
  });

  it("GET /transactions/balance soma receitas e despesas", async () => {
    const res = await request(app).get("/transactions/balance").set(bearer(token));

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual({ income: 3000, expense: 1500.25, balance: 1499.75 });
  });

  it("GET /transactions/balance é zero para quem não tem transações", async () => {
    const outro = await registerAndLogin("bia@exemplo.com", "senha123", "Bia");

    const res = await request(app).get("/transactions/balance").set(bearer(outro));

    expect(res.body.data).toEqual({ income: 0, expense: 0, balance: 0 });
  });

  it("GET /transactions/monthly agrupa por mês", async () => {
    await connection.query("UPDATE transactions SET created_at = '2026-01-15' WHERE title = 'Salário'");

    const res = await request(app).get("/transactions/monthly").set(bearer(token));

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([
      { month: "2026-01", income: 3000, expense: 0, balance: 3000 },
      expect.objectContaining({ income: 0, expense: 1500.25, balance: -1500.25 }),
    ]);
  });

  it("GET /transactions/dashboard junta saldo e resumo mensal", async () => {
    const res = await request(app).get("/transactions/dashboard").set(bearer(token));

    expect(res.status).toBe(200);
    expect(res.body.data.balance.balance).toBe(1499.75);
    expect(res.body.data.monthly).toHaveLength(1);
  });
});
