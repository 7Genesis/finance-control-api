import { z } from "zod";

/* ===================================================
   CREATE
=================================================== */
export const createTransactionSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),

  amount: z.coerce
    .number()
    .positive("Amount precisa ser maior que zero"),

  type: z.enum(["income", "expense"]),
});

/* ===================================================
   UPDATE
=================================================== */
export const updateTransactionSchema = z
  .object({
    title: z.string().min(1, "Título é obrigatório").optional(),

    amount: z.coerce
      .number()
      .positive("Amount precisa ser maior que zero")
      .optional(),

    type: z.enum(["income", "expense"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Envie pelo menos um campo para atualizar",
  });

/* ===================================================
   TYPES
=================================================== */

export type CreateTransactionInput = z.infer<
  typeof createTransactionSchema
>;

export type UpdateTransactionInput = z.infer<
  typeof updateTransactionSchema
>;