
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  login,
  logout,
  getToken,
  isAuthenticated,
} from "../services/authService";

describe("authService", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe("login", () => {
    it("sends the username and password to the auth server", async () => {
      const responseData = {
        accessToken: "test-token",
        expiresIn: 3600,
        subject: "testuser",
        roles: ["USER"],
      };

      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => responseData,
      } as Response);

      const result = await login({
        username: "testuser",
        password: "password123",
      });

      expect(fetch).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            username: "testuser",
            password: "password123",
          }),
        }
      );

      expect(result).toEqual(responseData);
    });

    it("throws an error when login fails", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
      } as Response);

      await expect(
        login({
          username: "wronguser",
          password: "wrongpassword",
        })
      ).rejects.toThrow("Login failed");
    });

    it("throws an error when the server cannot be reached", async () => {
      vi.mocked(fetch).mockRejectedValue(
        new Error("Network error")
      );

      await expect(
        login({
          username: "testuser",
          password: "password123",
        })
      ).rejects.toThrow("Network error");
    });
  });

  describe("logout", () => {
    it("sends a POST request to the logout endpoint", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
      } as Response);

      await logout();

      expect(fetch).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_BASE_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    });

    it("does not throw when the logout endpoint returns an error status", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
      } as Response);

      await expect(logout()).resolves.toBeUndefined();
    });
  });

  describe("getToken", () => {
    it("returns the stored access token", () => {
      localStorage.setItem("accessToken", "test-token");

      expect(getToken()).toBe("test-token");
    });

    it("returns null when no access token is stored", () => {
      expect(getToken()).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    it("returns true when the user is authenticated", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
      } as Response);

      await expect(isAuthenticated()).resolves.toBe(true);

      expect(fetch).toHaveBeenCalledWith(
        `${import.meta.env.VITE_API_BASE_URL}/appusers/me`,
        {
          method: "GET",
          credentials: "include",
        }
      );
    });

    it("returns false when the user is not authenticated", async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
      } as Response);

      await expect(isAuthenticated()).resolves.toBe(false);
    });
  });
});