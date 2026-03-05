"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    router.replace("/login"); // 🔥 importante
  }

  return (
    <button onClick={handleLogout}>
      Sair
    </button>
  );
}