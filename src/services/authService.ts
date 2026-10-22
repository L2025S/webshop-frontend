import type { LoginRequest, LoginResponse } from "../types/Auth.ts";

// Key used to identify the access token in local storage
const TOKEN_KEY = "accessToken";

// Base URL for the backend API, configured through an environment variable
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Authenticates the user with their username and password
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Includes cookies in the request and allows the server to set cookies in the response
    credentials: "include",
    // Sends the login credentials as a JSON object
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
    }),
  });

  // Throw an error if the server responds with an unsuccessful status code
  if (!response.ok) {
    throw new Error("Login failed");
  }

  // Parse and return the authentication response from the server
  return await response.json();
}

// Logs the user out by sending a logout request to the backend
export async function logout(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    // Includes the session cookie so the server can identify the user
    credentials: "include",
  });
}

// Retrieves the access token from local storage, or null if none exists
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// Checks whether the current user has a valid authenticated session
export async function isAuthenticated(): Promise<boolean> {
  const response = await fetch(`${API_BASE}/appusers/me`, {
    method: "GET",
    // Sends the session cookie so the backend can verify authentication
    credentials: "include",
  });

  // A successful response indicates that the user is authenticated
  return response.ok;
}
