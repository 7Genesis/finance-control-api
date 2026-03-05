import styles from "@/styles/skeleton.module.css";

export function SkeletonCards() {
  return (
    <div className={styles.cardsWrapper}>
      <div className={styles.card}></div>
      <div className={styles.card}></div>
      <div className={styles.card}></div>
    </div>
  );
}