export interface TransactionDTO {
    title: string;
    amount: number;
    type:"income" | "expense";
}