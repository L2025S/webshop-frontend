import { getToken } from "./authService.ts";
import type { User } from "../types/User.ts";

// Base URL for the backend API
const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Fetches the currently authenticated user
export async function getCurrentUser(): Promise<User> {
  // Get the stored access token
  const token = getToken();

  // Make sure the user is authenticated
  if (!token) {
    throw new Error("Not authenticated");
  }

  // Request the current user from the backend
  const response = await fetch(`${API_BASE}/appusers/me`, {
    method: "GET",
    headers: {
      // Send the JWT with the request
      Authorization: `Bearer ${token}`,
    },
  });

  // Throw an error if the request failed
  if (!response.ok) {
    throw new Error("Failed to get user");
  }

  // Convert the response into a User object
  return await response.json();
}
