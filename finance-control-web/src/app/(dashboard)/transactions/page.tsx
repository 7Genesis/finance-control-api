"use client";

import { useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionsTable } from "@/components/TransactionsTable";
import { SkeletonTable } from "@/components/SkeletonTable";
import { NewTransactionForm } from "@/components/NewTransactionForm";
import { Transaction } from "@/types/finance";

export default function TransactionsPage() {
  const {
    filtered,
    loading,
    page,
    search,
    setSearch,
    loadTransactions,
  } = useTransactions(5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Transações</h1>

      <input
        type="text"
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <SkeletonTable />
      ) : (
        <TransactionsTable
          transactions={filtered}
          onDeleted={() => loadTransactions(page)}
          onEdit={(tx) => {
            setEditingTransaction(tx);
            setIsModalOpen(true);
          }}
        />
      )}

      {isModalOpen && (
        <NewTransactionForm
          transaction={editingTransaction}
          onCreated={() => {
            loadTransactions(page);
            setIsModalOpen(false);
            setEditingTransaction(null);
          }}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
}