"use client";

import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>

      {user ? (
        <>
          <p>Usuário autenticado</p>
          <button onClick={logout}>Sair</button>
        </>
      ) : (
        <p>Não autenticado</p>
      )}
    </div>
  );
}