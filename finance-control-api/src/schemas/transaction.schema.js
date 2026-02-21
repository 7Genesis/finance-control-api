"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransactionSchema = exports.createTransactionSchema = void 0;
var zod_1 = require("zod");
/* ===================================================
   CREATE
=================================================== */
exports.createTransactionSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Título é obrigatório"),
    amount: zod_1.z.coerce
        .number()
        .positive("Amount precisa ser maior que zero"),
    type: zod_1.z.enum(["income", "expense"]),
});
/* ===================================================
   UPDATE
=================================================== */
exports.updateTransactionSchema = zod_1.z
    .object({
    title: zod_1.z.string().min(1, "Título é obrigatório").optional(),
    amount: zod_1.z.coerce
        .number()
        .positive("Amount precisa ser maior que zero")
        .optional(),
    type: zod_1.z.enum(["income", "expense"]).optional(),
})
    .refine(function (data) { return Object.keys(data).length > 0; }, {
    message: "Envie pelo menos um campo para atualizar",
});
