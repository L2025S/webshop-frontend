import type { LoginRequest, LoginResponse } from "../types/Auth.ts";

// Key used to store the JWT access token
const TOKEN_KEY = "accessToken";

// Base URL for the backend API
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Sends login credentials to the auth server
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
    }),
  });

  // Throw an error if the login request failed
  if (!response.ok) {
    throw new Error("Login failed");
  }

  return await response.json();
}

// Logs the user out
export async function logout(): Promise<void> { 
  await fetch(`${API_BASE}/auth/logout`, { 
    method: "POST", 
    credentials: "include", 
  }); 
}

// Get the stored access token
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// Checks whether the user is authenticated
export async function isAuthenticated(): Promise<boolean> { 
  const response = await fetch(`${API_BASE}/appusers/me`, { 
    method: "GET", 
    credentials: "include", 
  }); 
  return response.ok; 
}
