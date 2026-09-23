import type { LoginRequest, LoginResponse } from "../types/Auth.ts";

const TOKEN_KEY = "accessToken";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
    }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data: LoginResponse = await response.json();

  sessionStorage.setItem(TOKEN_KEY, data.accessToken);

  return data;
}

export function logout(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}
