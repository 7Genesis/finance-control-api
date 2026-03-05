import styles from "@/styles/skeleton.module.css";

export function SkeletonTable() {
  return (
    <div className={styles.tableWrapper}>
      {[1, 2, 3, 4, 5].map((row) => (
        <div key={row} className={styles.tableRow}>
          <div className={styles.tableCell}></div>
          <div className={styles.tableCell}></div>
          <div className={styles.tableCell}></div>
        </div>
      ))}
    </div>
  );
}