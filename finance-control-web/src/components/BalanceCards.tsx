import styles from "@/styles/cards.module.css";
import { formatCurrency } from "@/utils/format";
import { Balance } from "@/types/finance";

interface Props {
  balance: Balance;
}

export function BalanceCards({ balance }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h3>Entradas</h3>
        <p className={styles.income}>
          {formatCurrency(balance.income)}
        </p>
      </div>

      <div className={styles.card}>
        <h3>Saídas</h3>
        <p className={styles.expense}>
          {formatCurrency(balance.expense)}
        </p>
      </div>

      <div className={styles.card}>
        <h3>Saldo</h3>
        <p className={styles.balance}>
          {formatCurrency(balance.balance)}
        </p>
      </div>
    </div>
  );
}