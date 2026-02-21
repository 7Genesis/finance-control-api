"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_middleware_1 = require("../middlewares/auth.middleware");
var validate_middleware_1 = require("../middlewares/validate.middleware");
var transaction_schema_1 = require("../schemas/transaction.schema");
var transactions_controller_1 = require("../controllers/transactions.controller");
var router = (0, express_1.Router)();
/* ===================================================
   PROTECTED ROUTES
=================================================== */
router.use(auth_middleware_1.authenticate);
/* CREATE */
router.post("/", (0, validate_middleware_1.validate)(transaction_schema_1.createTransactionSchema), transactions_controller_1.createTransaction);
/* LIST */
router.get("/", transactions_controller_1.getTransactions);
/* BALANCE */
router.get("/balance", transactions_controller_1.getBalance);
/* MONTHLY */
router.get("/monthly", transactions_controller_1.getMonthlySummary);
/* DASHBOARD */
router.get("/dashboard", transactions_controller_1.getDashboard);
/* UPDATE */
router.put("/:id", (0, validate_middleware_1.validate)(transaction_schema_1.updateTransactionSchema), transactions_controller_1.updateTransaction);
/* DELETE */
router.delete("/:id", transactions_controller_1.deleteTransaction);
exports.default = router;
