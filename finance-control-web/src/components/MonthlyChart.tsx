"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/utils/format";

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

interface Props {
  data: MonthlyData[];
}

export function MonthlyChart({ data }: Props) {
  return (
    <div style={{ marginTop: 60 }}>
      <h2 style={{ marginBottom: 20, color: "#111827" }}>
        Resumo Mensal
      </h2>

      <ResponsiveContainer width="100%" height={340}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 70, bottom: 20 }}
        >
          <CartesianGrid
            stroke="#e5e7eb"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="month"
            stroke="#6b7280"
          />

          <YAxis
            width={90}
            stroke="#6b7280"
            tickFormatter={(value) =>
              formatCurrency(value)
            }
          />

          <Tooltip
            formatter={(value) =>
              formatCurrency(Number(value))
            }
            contentStyle={{
              backgroundColor: "#111827",
              border: "none",
              borderRadius: "10px",
              color: "#fff",
            }}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Entradas"
          />

          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Saídas"
          />

          <Line
            type="monotone"
            dataKey="balance"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4 }}
            name="Saldo"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}