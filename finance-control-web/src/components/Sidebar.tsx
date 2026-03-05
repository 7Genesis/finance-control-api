"use client";

import { usePathname, useRouter } from "next/navigation";
import styles from "@/styles/sidebar.module.css";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>Finance</h2>

      <nav className={styles.nav}>
        <button
          onClick={() => router.push("/dashboard")}
          className={pathname === "/dashboard" ? styles.active : ""}
        >
          Dashboard
        </button>

        <button
          onClick={() => router.push("/transactions")}
          className={pathname === "/transactions" ? styles.active : ""}
        >
          Transações
        </button>
      </nav>
    </aside>
  );
}