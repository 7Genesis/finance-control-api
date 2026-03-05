import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Transaction } from "@/types/finance";

export function useTransactions(limit = 5) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filter, setFilter] =
    useState<"all" | "income" | "expense">("all");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 🔥 Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  async function loadTransactions(currentPage = 1) {
    try {
      setLoading(true);

      const response = await api.get(
        `/transactions?page=${currentPage}&limit=${limit}`
      );

      setTransactions(response.data.data);
      setTotalPages(response.data.meta.pages);
      setPage(currentPage);
    } catch (error) {
      console.error("Erro ao carregar transações");
    } finally {
      setLoading(false);
    }
  }

  // 🔄 Inicial
  useEffect(() => {
    loadTransactions(1);
  }, []);

  // 🔥 Filtro combinado
  useEffect(() => {
    let result = transactions;

    if (filter !== "all") {
      result = result.filter((tx) => tx.type === filter);
    }

    if (debouncedSearch) {
      result = result.filter((tx) =>
        tx.title
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase())
      );
    }

    setFiltered(result);
  }, [filter, transactions, debouncedSearch]);

  return {
    filtered,
    loading,
    page,
    totalPages,
    search,
    filter,
    setSearch,
    setFilter,
    loadTransactions,
  };
}