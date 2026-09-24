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
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
    }),
  });

  // Throw an error if the login request failed
  if (!response.ok) {
    throw new Error("Login failed");
  }

  // Convert the response into a LoginResponse object
  const data: LoginResponse = await response.json();

  // Store the access token for the current session
  sessionStorage.setItem(TOKEN_KEY, data.accessToken);

  return data;
}

// Remove the access token when logging out
export function logout(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

// Get the stored access token
export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

// Check if an access token exists
export function isAuthenticated(): boolean {
  return getToken() !== null;
}
