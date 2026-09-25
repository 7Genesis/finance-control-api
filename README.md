# Finance Control

Aplicação web de controle financeiro pessoal: cada usuário tem a própria conta, registra receitas e despesas e acompanha o saldo e o resumo mensal em um dashboard.

- **Front-end** ([`finance-control-web`](finance-control-web)): Next.js 16, React 19, TypeScript e gráficos com Recharts. Demo: https://finance-control-nine-ashy.vercel.app
- **API** ([`finance-control-api`](finance-control-api)): Node.js, Express, TypeScript e **PostgreSQL**, com autenticação JWT e validação com Zod.

## O que a API faz

| Método | Rota | O que faz |
|---|---|---|
| `POST` | `/auth/register` | cria o usuário (senha com hash bcrypt) |
| `POST` | `/auth/login` | devolve o token JWT |
| `POST` | `/transactions` | cria uma receita (`income`) ou despesa (`expense`) |
| `GET` | `/transactions?page=1&limit=10` | lista as transações do usuário, com paginação |
| `PUT` | `/transactions/:id` | atualiza uma transação |
| `DELETE` | `/transactions/:id` | apaga uma transação |
| `GET` | `/transactions/balance` | receitas, despesas e saldo |
| `GET` | `/transactions/monthly` | resumo agrupado por mês |
| `GET` | `/transactions/dashboard` | saldo e resumo mensal numa resposta só |

As rotas de `/transactions` exigem o header `Authorization: Bearer <token>`, e cada consulta filtra pelo `user_id` do token, então um usuário não enxerga os dados de outro.

## Como rodar a API

Pré-requisitos: Node.js e um PostgreSQL.

```bash
cd finance-control-api
cp .env.example .env              # ajuste DATABASE_URL e JWT_SECRET
psql "$DATABASE_URL" -f schema.sql  # cria as tabelas users e transactions
npm install
npm run dev                       # http://localhost:3333
```

Exemplo rápido:

```bash
curl -X POST http://localhost:3333/auth/register -H "Content-Type: application/json" \
  -d '{ "name": "Ana", "email": "ana@exemplo.com", "password": "senha123" }'
```

## Como rodar o front-end

```bash
cd finance-control-web
npm install
NEXT_PUBLIC_API_URL=http://localhost:3333 npm run dev   # http://localhost:3000
```

Sem `NEXT_PUBLIC_API_URL`, o front usa a API publicada no Render.

## Estrutura da API

```
src/controllers/   recebem a requisição e devolvem a resposta
src/services/      regras e consultas SQL (pg)
src/middlewares/   autenticação JWT, validação (Zod) e tratamento de erros
src/schemas/       schemas Zod
src/routes/        rotas
```

## O que ainda falta

- Testes automatizados.
- Migrations versionadas (hoje o esquema está em `schema.sql`).
- Documentação Swagger: as dependências estão instaladas, mas a rota ainda não foi ligada.
