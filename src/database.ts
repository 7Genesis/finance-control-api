import * as mysql from "mysql2/promise";

export const connection = mysql.createPool({
    host: "localhost",
    user:"root",
    password: "123456",
    database: "finance_control",
});
