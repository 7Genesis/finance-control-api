// Roda antes de cada arquivo de teste e antes de qualquer import da aplicação
// (auth.service e auth.middleware leem JWT_SECRET no momento do import).
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "segredo-somente-para-testes";
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/finance_test";
