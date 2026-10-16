import { connection } from "../../src/database";

export const resetDatabase = async () => {
  await connection.query("TRUNCATE transactions, users RESTART IDENTITY CASCADE");
};

export const closeDatabase = async () => {
  await connection.end();
};
