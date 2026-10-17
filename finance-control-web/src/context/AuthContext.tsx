"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/services/api";

interface AuthUser {
  authenticated: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // O token só pode ser lido depois da montagem (localStorage não existe no servidor).
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser({ authenticated: true });
    }
  }, []);

  async function login(email: string, password: string) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token } = response.data;

    localStorage.setItem("token", token);
    setUser({ authenticated: true });
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}