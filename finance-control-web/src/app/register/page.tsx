"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import styles from "@/styles/login.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ ajuste o endpoint conforme teu backend
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      // Se a API já devolver token:
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        router.replace("/dashboard");
        return;
      }

      // Se não devolver token, volta pro login
      router.replace("/login");
    } catch (err: any) {
      setError("Não foi possível criar a conta. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1>Criar conta</h1>
        <p className={styles.subtitle}>Crie sua conta para acessar</p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p style={{ color: "#ef4444", marginBottom: 12 }}>{error}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <span style={{ color: "#9ca3af" }}>Já tem conta?</span>{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            style={{
              background: "none",
              border: "none",
              color: "#3b82f6",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}