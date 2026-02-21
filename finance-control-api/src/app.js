"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var transactions_routes_1 = require("./routes/transactions.routes");
var error_middleware_1 = require("./middlewares/error.middleware");
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
/**
 * Health Check Route
 */
app.get("/", function (req, res) {
    return res.status(200).json({
        status: "ok",
        service: "Finance Control API",
        environment: process.env.NODE_ENV,
    });
});
app.use("/transactions", transactions_routes_1.default);
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
