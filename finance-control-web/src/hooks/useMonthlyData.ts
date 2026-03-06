"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { MonthlyData } from "@/types/finance";

export function useMonthlyData() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);


  async function loadMonthlyData() {
    try {
      setLoading(true);

      const response = await api.get("/transactions/monthly");
      setMonthlyData(response.data.data);
    } catch (error) {
      console.error("Erro ao carregar dados mensais");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMonthlyData();
  }, []);

  return {
    monthlyData,
    loading,
    reloadMonthlyData: loadMonthlyData,
  };
}