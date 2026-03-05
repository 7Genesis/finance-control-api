export interface Balance {
  income: number;
  expense: number;
  balance: number;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  created_at?: string;
}
export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
}