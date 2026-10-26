# Finance Control

[![CI](https://github.com/7Genesis/finance-control-api/actions/workflows/ci.yml/badge.svg)](https://github.com/7Genesis/finance-control-api/actions/workflows/ci.yml)
[![Licença: MIT](https://img.shields.io/badge/licença-MIT-blue.svg)](LICENSE)

Aplicação web de controle financeiro pessoal: cada usuário tem a própria conta, registra receitas e despesas e acompanha o saldo e o resumo mensal em um dashboard.

**Problema que resolve:** saber quanto entrou, quanto saiu e qual é o saldo, mês a mês, sem planilha. O foco do projeto está na API: autenticação, isolamento dos dados de cada usuário e cálculo de saldo no banco.

- **Front-end** ([`finance-control-web`](finance-control-web)): Next.js 16, React 19, TypeScript e gráficos com Recharts. Demo: https://finance-control-nine-ashy.vercel.app
- **API** ([`finance-control-api`](finance-control-api)): Node.js, Express, TypeScript e **PostgreSQL**, com autenticação JWT e validação com Zod.

## Resultado verificável

- **30 testes de integração** (3 arquivos, Jest + supertest) rodam contra um PostgreSQL de verdade, sem mock de banco. Última execução local: 30 passaram, e o `npm run build` (tsc) da API compilou sem erros.
- O [CI](.github/workflows/ci.yml) repete build e testes a cada push na `main` e a cada pull request (o selo no topo mostra o estado atual).
- Demo do front-end no ar (link acima) e documentação interativa da API em `/docs` (Swagger).

## Decisões técnicas

| Decisão | Por quê |
|---|---|
| Valores em `NUMERIC(12, 2)`, não `float` | evita erro de arredondamento em dinheiro. O `pg` devolve `NUMERIC` como texto, então a API converte para número na resposta (coberto por teste). |
| Saldo e resumo mensal calculados no SQL (`SUM(CASE ...)`, `GROUP BY`) | o banco agrega, a API não carrega todas as transações na memória. |
| Todas as consultas filtram por `user_id` do token (`WHERE id = $1 AND user_id = $2`) | um usuário não lê, altera nem apaga dado de outro (update e delete na transação alheia dão 404). Testes cobrem os três casos e conferem que o dado do outro usuário continua intacto. |
| SQL com parâmetros (`$1`, `$2`) e colunas do `UPDATE` montadas a partir de uma lista fixa | sem concatenar entrada do usuário no SQL. |
| Validação com Zod antes do controller | o corpo inválido volta com 400 e mensagem clara, e a regra fica num só lugar (`src/schemas/`). |
| Senha com `bcrypt` e JWT com validade de 1 dia | a senha nunca é guardada em texto puro (teste confere o hash) e a API não mantém sessão no servidor. |
| `type` com `CHECK (type IN ('income', 'expense'))` e `ON DELETE CASCADE` | o banco também barra valor inválido e não deixa transação órfã. |
| Índice `(user_id, created_at DESC)` | acelera a listagem paginada, que sempre filtra por usuário e ordena pela data. |
| Camadas `routes` > `controllers` > `services` | o SQL fica nos services; os controllers só tratam HTTP. |

## Capturas de tela

Dados fictícios, em uma instância local.

![Dashboard com entradas, saídas, saldo e o resumo mensal](docs/dashboard.png)

![Documentação Swagger da API](docs/swagger.png)

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

A documentação interativa (Swagger UI) fica em `http://localhost:3333/docs`.

Exemplo rápido:

```bash
curl -X POST http://localhost:3333/auth/register -H "Content-Type: application/json" \
  -d '{ "name": "Ana", "email": "ana@exemplo.com", "password": "senha123" }'
```

## Como rodar os testes (API)

Os testes (30, em 3 arquivos) são de integração: sobem o app Express com o `supertest` e usam um **PostgreSQL de verdade**, então você precisa de um banco de teste. Jest + ts-jest.

```bash
# 1. um Postgres descartável (ou use o seu e crie o banco finance_test)
docker run -d --rm --name finance-pg-test -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=finance_test postgres:16

# 2. rodar a suíte
cd finance-control-api
npm install
TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/finance_test npm test
```

- Sem `TEST_DATABASE_URL`, usa `postgresql://postgres:postgres@localhost:5432/finance_test`.
- Antes da suíte, `schema.sql` é aplicado (as tabelas `users` e `transactions` são **apagadas e recriadas**). Por segurança, o nome do banco precisa terminar em `_test`; qualquer outro nome faz a suíte abortar.
- Cobertura atual: cadastro e login (hash, e-mail duplicado, validação, JWT), proteção das rotas por token, CRUD de transações, paginação, isolamento entre usuários, saldo, resumo mensal e dashboard.
- O front-end ainda não tem testes.

Integração contínua: o workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) roda `npm ci`, `npm run build` e `npm test` da API (com um serviço PostgreSQL) e o `npm run build` do front a cada push na `main` e a cada pull request. O `npm run lint` do front também roda no CI (ele tem avisos, mas nenhum erro).

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

- Testes automatizados do front-end (a API já tem testes de integração).
- Migrations versionadas (hoje o esquema está em `schema.sql`).
- Data da transação informada pelo usuário: hoje `created_at` é a data de criação, e o resumo mensal agrupa por ela.
