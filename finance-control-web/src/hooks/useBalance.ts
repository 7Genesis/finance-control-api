"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Balance } from "@/types/finance";

export function useBalance() {
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadBalance() {
    try {
      setLoading(true);

      const response = await api.get("/transactions/balance");
      setBalance(response.data.data);
    } catch (error) {
      console.error("Erro ao carregar saldo");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBalance();
  }, []);

  return {
    balance,
    loading,
    reloadBalance: loadBalance,
  };
}