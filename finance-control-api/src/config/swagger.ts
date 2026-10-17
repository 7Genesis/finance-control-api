// Documentação OpenAPI escrita à mão, servida em /docs (Swagger UI).
const bearer = [{ bearerAuth: [] }];

const jsonBody = (schema: object) => ({
  required: true,
  content: { "application/json": { schema } },
});

const idParam = {
  name: "id",
  in: "path",
  required: true,
  schema: { type: "string" },
};

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Finance Control API",
    version: "1.0.0",
    description: "API de controle financeiro pessoal",
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Cria o usuário",
        requestBody: jsonBody({
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", minLength: 2 },
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
        }),
        responses: { "201": { description: "Usuário criado" }, "400": { description: "Dados inválidos ou e-mail já cadastrado" } },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Devolve o token JWT",
        requestBody: jsonBody({
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
        }),
        responses: { "200": { description: "Login feito, com o token" }, "400": { description: "Credenciais inválidas" } },
      },
    },
    "/transactions": {
      post: {
        tags: ["Transações"],
        summary: "Cria uma receita ou despesa",
        security: bearer,
        requestBody: jsonBody({
          type: "object",
          required: ["title", "amount", "type"],
          properties: {
            title: { type: "string" },
            amount: { type: "number", exclusiveMinimum: 0 },
            type: { type: "string", enum: ["income", "expense"] },
          },
        }),
        responses: { "201": { description: "Transação criada" }, "400": { description: "Dados inválidos" }, "401": { description: "Sem token ou token inválido" } },
      },
      get: {
        tags: ["Transações"],
        summary: "Lista as transações do usuário, com paginação",
        security: bearer,
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
        ],
        responses: { "200": { description: "Lista paginada" }, "401": { description: "Sem token ou token inválido" } },
      },
    },
    "/transactions/{id}": {
      put: {
        tags: ["Transações"],
        summary: "Atualiza uma transação",
        security: bearer,
        parameters: [idParam],
        requestBody: jsonBody({
          type: "object",
          properties: {
            title: { type: "string" },
            amount: { type: "number", exclusiveMinimum: 0 },
            type: { type: "string", enum: ["income", "expense"] },
          },
        }),
        responses: { "200": { description: "Transação atualizada" }, "400": { description: "Dados inválidos" }, "401": { description: "Sem token ou token inválido" }, "404": { description: "Transação não encontrada" } },
      },
      delete: {
        tags: ["Transações"],
        summary: "Apaga uma transação",
        security: bearer,
        parameters: [idParam],
        responses: { "200": { description: "Transação apagada" }, "401": { description: "Sem token ou token inválido" }, "404": { description: "Transação não encontrada" } },
      },
    },
    "/transactions/balance": {
      get: {
        tags: ["Transações"],
        summary: "Receitas, despesas e saldo",
        security: bearer,
        responses: { "200": { description: "Saldo do usuário" }, "401": { description: "Sem token ou token inválido" } },
      },
    },
    "/transactions/monthly": {
      get: {
        tags: ["Transações"],
        summary: "Resumo agrupado por mês",
        security: bearer,
        responses: { "200": { description: "Resumo mensal" }, "401": { description: "Sem token ou token inválido" } },
      },
    },
    "/transactions/dashboard": {
      get: {
        tags: ["Transações"],
        summary: "Saldo e resumo mensal numa resposta só",
        security: bearer,
        responses: { "200": { description: "Dados do dashboard" }, "401": { description: "Sem token ou token inválido" } },
      },
    },
  },
};

export default swaggerSpec;
