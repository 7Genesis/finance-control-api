"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
var errorMiddleware = function (error, req, res, next) {
    console.error("🔥 ERROR:", error);
    var statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
        success: false,
        error: error.message || "Erro interno do servidor",
    });
};
exports.errorMiddleware = errorMiddleware;
