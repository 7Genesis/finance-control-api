import axios from "axios";

export const api = axios.create({
  baseURL: "https://finance-control-api-8qpp.onrender.com",
});

api.interceptors.request.use((config) => {
  // ✅ Não manda token nas rotas públicas
  const isAuthRoute = config.url?.startsWith("/auth");

  if (isAuthRoute) return config;

  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});