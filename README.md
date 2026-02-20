# 💰 Finance Control API

API REST para controle financeiro desenvolvida com Node.js, Express, TypeScript e MySQL, com autenticação JWT, dashboard analítico e boas práticas de arquitetura.

REST API for financial control built with Node.js, Express, TypeScript and MySQL, featuring JWT authentication, dashboard analytics and production-ready structure.

---

## 🚀 Tecnologias | Technologies

- Node.js
- Express
- TypeScript
- MySQL
- JWT (JSON Web Token)
- Zod (Validação)
- Dotenv
- Arquitetura em camadas (Controller → Service)

---

## 📌 Funcionalidades | Features

### 🔐 Autenticação
- Registro de usuário
- Login com geração de token JWT
- Rotas protegidas por middleware

### 💸 Transações
- Criar transação (income/expense)
- Listar com paginação
- Filtros por tipo e data
- Ordenação dinâmica
- Atualizar transação
- Deletar transação

### 📊 Dashboard
- Saldo total
- Resumo por período
- Resumo mensal agrupado
- Endpoint consolidado `/dashboard`

---

## 🏗 Estrutura do Projeto | Project Structure

src/
├── controllers/
├── services/
├── middlewares/
├── routes/
├── schemas/
├── types/
├── utils/
├── database.ts
└── server.ts

---

## ⚙️ Variáveis de Ambiente | Environment Variables

Crie um arquivo `.env` na raiz do projeto:

PORT=3000
JWT_SECRET=sua_chave_super_secreta
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=finance_control

---

## ▶️ Como rodar o projeto | Running the Project

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

Servidor rodando em:

http://localhost:3000


⸻

🔒 Segurança
	•	JWT Secret protegido via variável de ambiente
	•	Rotas protegidas por middleware de autenticação
	•	Validação de dados com Zod
	•	Tratamento centralizado de erros
	•	Proteção contra acesso a dados de outros usuários

⸻

📈 Endpoints Principais | Main Endpoints

Auth

POST   /auth/register
POST   /auth/login

Transactions

POST   /transactions
GET    /transactions
PUT    /transactions/:id
DELETE /transactions/:id

Dashboard

GET /transactions/balance
GET /transactions/summary
GET /transactions/monthly
GET /transactions/dashboard


⸻

🎯 Diferenciais Técnicos | Technical Highlights
	•	Estrutura modular e escalável
	•	Separação clara de responsabilidades
	•	Uso correto de status HTTP
	•	Tratamento de erros customizado
	•	Proteção por userId em todas operações
	•	Código preparado para deploy

⸻

📌 Status

🚀 Projeto em evolução contínua.

⸻

👨‍💻 Autor | Author

Genesis Melo
Backend Developer

---
