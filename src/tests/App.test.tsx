import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import App from "../App";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { mockProducts } from "../mocks/data";

function renderApp() {
  return render(
    // Render the application on the products page.
    <MemoryRouter initialEntries={["/products"]}>
      <CartProvider>
        <App />
      </CartProvider>
    </MemoryRouter>,
  );
}

// Used only for the authentication tests.
// it renders without products
function renderAuthApp() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <CartProvider>
        <App />
      </CartProvider>
    </MemoryRouter>,
  );
}

describe("App products tests using MSW", () => {
  it("Allows an authenticated user to view products", async () => {
    server.use(
      // Mock a logged in user through the gateway.
      http.get("*/auth/me", () => {
        return HttpResponse.json({
          username: "testuser",
          roles: ["USER"],
        });
      }),

      // Mock the products request through the gateway.
      http.get("*/products/all", () => {
        return HttpResponse.json(mockProducts);
      }),

      // Mock the categories request through the gateway.
      http.get("*/categories/all", () => {
        return HttpResponse.json([]);
      }),
    );

    renderApp();

    // Check that products are displayed.
    expect(await screen.findByText(mockProducts[0].name)).toBeInTheDocument();
  });

  it("Displays an error message when the products API fails", async () => {
    server.use(
      // Mock a logged in user.
      http.get("*/auth/me", () => {
        return HttpResponse.json({
          username: "testuser",
          roles: ["USER"],
        });
      }),

      // Make the products request fail.
      http.get("*/products/all", () => {
        return HttpResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        );
      }),

      // Categories still load successfully.
      http.get("*/categories/all", () => {
        return HttpResponse.json([]);
      }),
    );

    renderApp();

    // Check that the product error is displayed.
    expect(
      await screen.findByText(/failed to load products \(status code: 500\)/i),
    ).toBeInTheDocument();
  });

  it("shows Logout for a logged in user", async () => {
    // Mock a successful current-user request.
    server.use(
      http.get("*/appusers/me", () => {
        return HttpResponse.json({
          username: "testuser",
          roles: ["USER"],
        });
      }),
    );

    renderAuthApp();

    // Check that the user is treated as logged in.
    expect(
      await screen.findByRole("button", { name: /logout/i }),
    ).toBeInTheDocument();
  });

  it("shows Login for a logged out user", async () => {
    let wasCurrentUserRequested = false;

    // Mock a 401 response for the current-user request.
    server.use(
      http.get("*/appusers/me", () => {
        wasCurrentUserRequested = true;

        return HttpResponse.json(
          { message: "Unauthorized" },
          { status: 401 },
        );
      }),
    );

    renderAuthApp();

    // Wait until the authentication request has actually happened.
    await waitFor(() =>
      expect(wasCurrentUserRequested).toBe(true),
    );

    // Check that the user is treated as logged out.
    expect(
      screen.getByRole("link", { name: /login/i }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /logout/i }),
    ).not.toBeInTheDocument();
  });
});