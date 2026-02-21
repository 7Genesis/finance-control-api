// eslint-disable-next-line @typescript-eslint/no-var-requires
import { Pool } from "pg";

export const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});