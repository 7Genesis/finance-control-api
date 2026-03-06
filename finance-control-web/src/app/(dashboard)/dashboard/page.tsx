
import { use, useState } from "react";

import { useBalance } from "@/hooks/useBalance";
import { useMonthlyData } from "@/hooks/useMonthlyData";

import { BalanceCards } from "@/components/BalanceCards";
import { SkeletonCards } from "@/components/SkeletonCards";
import { MonthlyChart } from "@/components/MonthlyChart";
import { NewTransactionForm } from "@/components/NewTransactionForm";

import styles from "@/styles/dashboard.module.css";

export default function DashboardPage() {
  const { balance, loading, reloadBalance } = useBalance();
  const { monthlyData, loading: monthlyLoading, reloadMonthlyData } =
    useMonthlyData();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>

      {/* CARDS */}
      {loading || !balance ? (
        <SkeletonCards />
      ) : (
        <BalanceCards balance={balance} />
      )}

      {/* BOTÃO NOVA TRANSAÇÃO */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={styles.newButton}
      >
        Nova Transação
      </button>

      {/* GRÁFICO */}
      {!monthlyLoading && monthlyData.length > 0 && (
        <MonthlyChart data={monthlyData} />
      )}

      {/* MODAL */}
      {isModalOpen && (
        <NewTransactionForm
          onCreated={() => {
            reloadBalance();
            reloadMonthlyData();
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}