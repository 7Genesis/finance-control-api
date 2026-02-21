"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires
var pg_1 = require("pg");
exports.connection = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
