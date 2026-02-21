"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthlySummaryService = exports.getBalanceService = exports.deleteTransactionService = exports.updateTransactionService = exports.getTransactionsService = exports.createTransactionService = void 0;
var database_1 = require("../database");
var AppError_1 = require("../utils/AppError");
/* ===================================================
   CREATE
=================================================== */
var createTransactionService = function (data, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var title, amount, type, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                title = data.title, amount = data.amount, type = data.type;
                return [4 /*yield*/, database_1.connection.query("\n    INSERT INTO transactions (title, amount, type, user_id)\n    VALUES ($1, $2, $3, $4)\n    RETURNING id\n    ", [title, amount, type, userId])];
            case 1:
                result = _a.sent();
                return [2 /*return*/, {
                        message: "Transação criada com sucesso",
                        id: result.rows[0].id,
                    }];
        }
    });
}); };
exports.createTransactionService = createTransactionService;
/* ===================================================
   LIST ALL
=================================================== */
var getTransactionsService = function (userId_1, _a) { return __awaiter(void 0, [userId_1, _a], void 0, function (userId, _b) {
    var safePage, safeLimit, offset, result, countResult, total, pages;
    var page = _b.page, limit = _b.limit;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                safePage = Number(page) || 1;
                safeLimit = Number(limit) || 10;
                offset = (safePage - 1) * safeLimit;
                return [4 /*yield*/, database_1.connection.query("\n    SELECT * FROM transactions\n    WHERE user_id = $1\n    ORDER BY created_at DESC\n    LIMIT $2 OFFSET $3\n    ", [userId, safeLimit, offset])];
            case 1:
                result = _c.sent();
                return [4 /*yield*/, database_1.connection.query("SELECT COUNT(*) FROM transactions WHERE user_id = $1", [userId])];
            case 2:
                countResult = _c.sent();
                total = Number(countResult.rows[0].count);
                pages = Math.ceil(total / safeLimit);
                return [2 /*return*/, {
                        data: result.rows,
                        meta: {
                            page: safePage,
                            limit: safeLimit,
                            total: total,
                            pages: pages,
                        },
                    }];
        }
    });
}); };
exports.getTransactionsService = getTransactionsService;
/* ===================================================
   UPDATE
=================================================== */
var updateTransactionService = function (id, userId, data) { return __awaiter(void 0, void 0, void 0, function () {
    var fields, values, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fields = [];
                values = [];
                if (data.title !== undefined) {
                    values.push(data.title);
                    fields.push("title = $".concat(values.length));
                }
                if (data.amount !== undefined) {
                    values.push(Number(data.amount));
                    fields.push("amount = $".concat(values.length));
                }
                if (data.type !== undefined) {
                    values.push(data.type);
                    fields.push("type = $".concat(values.length));
                }
                if (fields.length === 0) {
                    throw new AppError_1.AppError("Nenhum campo para atualizar", 400);
                }
                values.push(id);
                values.push(userId);
                return [4 /*yield*/, database_1.connection.query("\n      UPDATE transactions\n      SET ".concat(fields.join(", "), "\n      WHERE id = $").concat(values.length - 1, "\n      AND user_id = $").concat(values.length, "\n    "), values)];
            case 1:
                result = _a.sent();
                if (result.rowCount === 0) {
                    throw new AppError_1.AppError("Transação não encontrada", 404);
                }
                return [2 /*return*/, { message: "Transação atualizada com sucesso" }];
        }
    });
}); };
exports.updateTransactionService = updateTransactionService;
/* ===================================================
   DELETE
=================================================== */
var deleteTransactionService = function (id, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.connection.query("DELETE FROM transactions WHERE id = $1 AND user_id = $2", [id, userId])];
            case 1:
                result = _a.sent();
                if (result.rowCount === 0) {
                    throw new AppError_1.AppError("Transação não encontrada", 404);
                }
                return [2 /*return*/, { message: "Transação deletada com sucesso" }];
        }
    });
}); };
exports.deleteTransactionService = deleteTransactionService;
/* ===================================================
   BALANCE
=================================================== */
var getBalanceService = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var result, income, expense;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.connection.query("\n    SELECT\n      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,\n      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expense\n    FROM transactions\n    WHERE user_id = $1\n    ", [userId])];
            case 1:
                result = _a.sent();
                income = Number(result.rows[0].income) || 0;
                expense = Number(result.rows[0].expense) || 0;
                return [2 /*return*/, {
                        income: income,
                        expense: expense,
                        balance: income - expense,
                    }];
        }
    });
}); };
exports.getBalanceService = getBalanceService;
/* ===================================================
   MONTHLY SUMMARY
=================================================== */
var getMonthlySummaryService = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, database_1.connection.query("\n      SELECT \n        TO_CHAR(created_at, 'YYYY-MM') as month_label,\n        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,\n        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense\n      FROM transactions\n      WHERE user_id = $1\n      GROUP BY month_label\n      ORDER BY month_label\n      ", [userId])];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result.rows.map(function (row) {
                        var income = Number(row.total_income) || 0;
                        var expense = Number(row.total_expense) || 0;
                        return {
                            month: row.month_label,
                            income: income,
                            expense: expense,
                            balance: income - expense,
                        };
                    })];
        }
    });
}); };
exports.getMonthlySummaryService = getMonthlySummaryService;
