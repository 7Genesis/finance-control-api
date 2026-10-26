import request from "supertest";
import app from "../src/app";
import { connection } from "../src/database";
import { errorMiddleware } from "../src/middlewares/error.middleware";
import { AppError } from "../src/utils/AppError";
import { resetDatabase, closeDatabase } from "./helpers/db";

beforeEach(resetDatabase);
afterEach(() => jest.restoreAllMocks());
afterAll(closeDatabase);

describe("POST /auth/login com falha interna", () => {
  it("não devolve a mensagem do erro do banco", async () => {
    jest.spyOn(connection as any, "query").mockRejectedValueOnce(new Error('relation "users" does not exist'));

    const res = await request(app).post("/auth/login").send({ email: "ana@exemplo.com", password: "senha123" });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ success: false, message: "Erro interno do servidor" });
    expect(JSON.stringify(res.body)).not.toContain("relation");
  });
});

describe("errorMiddleware", () => {
  const responder = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };
  const chamar = (erro: any) => {
    const res = responder();
    errorMiddleware(erro, {} as any, res, jest.fn());
    return res;
  };

  it("mantém status e mensagem de erro conhecido", () => {
    const res = chamar(new AppError("Transação não encontrada", 404));

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Transação não encontrada" });
  });

  it("esconde a mensagem de erro desconhecido", () => {
    const res = chamar(new Error("connect ECONNREFUSED 10.0.0.5:5432"));

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Erro interno do servidor" });
  });

  it("mantém o status 4xx de erro de biblioteca, sem a mensagem original", () => {
    const erro: any = new SyntaxError("Unexpected token } in JSON at position 5");
    erro.statusCode = 400;
    const res = chamar(erro);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: "Requisição inválida" });
  });
});
