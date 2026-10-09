import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function AdminRoute() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const response = await fetch(`${API_BASE}/appusers/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          setIsAdmin(false);
          return;
        }

        const user = await response.json();

        setIsAdmin(user.role === "ADMIN");
      } catch {
        setIsAdmin(false);
      }
    }

    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return null;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}