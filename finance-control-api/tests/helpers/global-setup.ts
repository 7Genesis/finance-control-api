import fs from "fs";
import path from "path";
import { Client } from "pg";

export const DEFAULT_TEST_DATABASE_URL =
  "postgresql://postgres:postgres@localhost:5432/finance_test";

// Recria as tabelas a partir do schema.sql antes da suíte. Por segurança,
// recusa rodar contra um banco cujo nome não termine em "_test".
export default async function globalSetup() {
  const url = process.env.TEST_DATABASE_URL ?? DEFAULT_TEST_DATABASE_URL;
  const dbName = new URL(url).pathname.replace("/", "");

  if (!dbName.endsWith("_test")) {
    throw new Error(
      `TEST_DATABASE_URL deve apontar para um banco que termine em "_test" (recebido: "${dbName}"). ` +
        "A suíte apaga e recria as tabelas."
    );
  }

  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    await client.query("DROP TABLE IF EXISTS transactions, users CASCADE");
    const schema = fs.readFileSync(path.join(__dirname, "../../schema.sql"), "utf8");
    await client.query(schema);
  } finally {
    await client.end();
  }
}
