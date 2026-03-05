import { Sidebar } from "@/components/Sidebar";
import { LogoutButton } from "@/components/LogoutButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import styles from "@/styles/dashboardLayout.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <Sidebar />

        <div className={styles.mainArea}>
          <header className={styles.header}>
            <LogoutButton />
          </header>

          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}