"use client";

import { useState } from "react";
import { Transaction } from "@/types/finance";
import { api } from "@/services/api";
import styles from "@/styles/table.module.css";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import toast from "react-hot-toast";

interface Props {
  transactions: Transaction[];
  onDeleted?: () => void;
  onEdit?: (transaction: Transaction) => void;
}

export function TransactionsTable({
  transactions,
  onDeleted,
  onEdit,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function confirmDelete() {
    if (!selectedId) return;

    try {
      setDeletingId(selectedId);

      await api.delete(`/transactions/${selectedId}`);

      toast.success("Transação excluída com sucesso");

      onDeleted?.();
    } catch (error) {
      toast.error("Erro ao excluir transação");
    } finally {
      setDeletingId(null);
      setSelectedId(null);
    }
  }

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Valor</th>
            <th>Tipo</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.title}</td>
              <td>R$ {tx.amount}</td>
              <td>
                {tx.type === "income" ? "Entrada" : "Saída"}
              </td>
              <td>
                <button
                  onClick={() => onEdit?.(tx)}
                  style={{ marginRight: 8 }}
                >
                  Editar
                </button>

                <button
                  className={styles.deleteButton}
                  onClick={() => setSelectedId(tx.id)}
                  disabled={deletingId === tx.id}
                >
                  {deletingId === tx.id ? "Excluindo..." : "Excluir"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedId && (
        <ConfirmDialog
          message="Tem certeza que deseja excluir esta transação?"
          onCancel={() => setSelectedId(null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}