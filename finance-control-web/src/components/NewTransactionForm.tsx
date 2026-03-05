"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import styles from "@/styles/form.module.css";
import toast from "react-hot-toast";
import { Transaction } from "@/types/finance";

interface Props {
  onCreated: () => void;
  onClose: () => void;
  transaction?: Transaction | null;
}

export function NewTransactionForm({
  onCreated,
  onClose,
  transaction,
}: Props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    title?: string;
    amount?: string;
  }>({});

  // 🔥 Máscara de moeda
  function handleAmountChange(value: string) {
    const numbersOnly = value.replace(/\D/g, "");

    if (!numbersOnly) {
      setAmount("");
      return;
    }

    const amountNumber = Number(numbersOnly) / 100;

    const formatted = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(amountNumber);

    setAmount(formatted);

    if (errors.amount) {
      setErrors((prev) => ({
        ...prev,
        amount: undefined,
      }));
    }
  }

  // 🔥 Preenche campos na edição
  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title);

      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(transaction.amount);

      setAmount(formatted);
      setType(transaction.type);
    }
  }, [transaction]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmedTitle = title.trim();

    // 🔥 Converte máscara para número real
    const numericAmount =
      Number(amount.replace(/\D/g, "")) / 100;

    const newErrors: typeof errors = {};

    if (trimmedTitle.length < 3) {
      newErrors.title = "Título deve ter pelo menos 3 caracteres";
    }

    if (!numericAmount || numericAmount <= 0) {
      newErrors.amount = "Valor deve ser maior que zero";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    
    console.log("Enviando:", {
  title: trimmedTitle,
  amount: numericAmount,
  type,
});

    try {
      if (transaction) {
        await api.put(`/transactions/${transaction.id}`, {
          title: trimmedTitle,
          amount: numericAmount,
          type,
        });

        toast.success("Transação atualizada!");
      } else {
        await api.post("/transactions", {
          title: trimmedTitle,
          amount: numericAmount,
          type,
        });

        toast.success("Transação criada!");
      }

      onCreated();
      onClose();
    } catch (error) {
      toast.error("Erro ao salvar transação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>
          {transaction ? "Editar Transação" : "Nova Transação"}
        </h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            {/* TÍTULO */}
            <div className={styles.field}>
              <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) {
                    setErrors((prev) => ({
                      ...prev,
                      title: undefined,
                    }));
                  }
                }}
                className={errors.title ? styles.inputError : ""}
              />
              {errors.title && (
                <span className={styles.errorText}>
                  {errors.title}
                </span>
              )}
            </div>

            {/* VALOR */}
            <div className={styles.field}>
            <input
            type="text"
            inputMode="numeric"
            placeholder="Valor"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            onPaste={(e) => {
            const paste = e.clipboardData.getData("text");
            const numbersOnly = paste.replace(/\D/g, "");

            if (!numbersOnly) {
            e.preventDefault();
    }
  }}
  className={errors.amount ? styles.inputError : ""}
/>
              {errors.amount && (
                <span className={styles.errorText}>
                  {errors.amount}
                </span>
              )}
            </div>

            {/* TIPO */}
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as "income" | "expense")
              }
            >
              <option value="income">Entrada</option>
              <option value="expense">Saída</option>
            </select>

            {/* BOTÃO SALVAR */}
            <button type="submit" disabled={loading}>
              {loading
                ? "Salvando..."
                : transaction
                ? "Atualizar"
                : "Salvar"}
            </button>

            {/* BOTÃO CANCELAR */}
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}