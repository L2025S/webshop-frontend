import { getToken } from "./AuthService.ts";
import type { User } from "../types/User.ts";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function getCurrentUser(): Promise<User> {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE}/appusers/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to get user");
  }

  return await response.json();
}
