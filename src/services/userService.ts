
import type { User } from "../types/User.ts";

// Base URL for the backend API
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Fetches the currently authenticated user
export async function getCurrentUser(): Promise<User> {
 
  // Request the current user from the backend
  const response = await fetch(`${API_BASE}/appusers/me`, {
    method: "GET",
    credentials: "include",
  });

  // Throw an error if the request failed
  if (!response.ok) {
    throw new Error("Failed to get user");
  }

  // Convert the response into a User object
  return await response.json();
}
