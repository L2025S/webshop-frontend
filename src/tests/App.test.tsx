import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
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

describe("App products tests using MSW", () => {
  it("Allows an authenticated user to view products", async () => {
    server.use(
      // Mock a logged in user through the gateway.
      http.get("*/gateway/auth/me", () => {
        return HttpResponse.json({
          username: "testuser",
          roles: ["USER"],
        });
      }),

      // Mock the products request through the gateway.
      http.get("*/gateway/products/all", () => {
        return HttpResponse.json(mockProducts);
      }),

      // Mock the categories request through the gateway.
      http.get("*/gateway/categories/all", () => {
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
      http.get("*/gateway/auth/me", () => {
        return HttpResponse.json({
          username: "testuser",
          roles: ["USER"],
        });
      }),

      // Make the products request fail.
      http.get("*/gateway/products/all", () => {
        return HttpResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        );
      }),

      // Categories still load successfully.
      http.get("*/gateway/categories/all", () => {
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
  // Mock a successful /auth/me response from the gateway.
  server.use(
    http.get("*/appusers/me", () => {
      return HttpResponse.json({
        username: "testuser",
        roles: ["USER"],
      });
    })
  );

  // Render the app.
  renderApp();

  // The user should be treated as logged in.
  expect(
    await screen.findByRole("button", { name: /logout/i })
  ).toBeInTheDocument();
});


it("shows Login for a logged out user", async () => {
  // Mock a 401 response from /auth/me.
  server.use(
    http.get("*/appusers/me", () => {
      return new HttpResponse(null, {
        status: 401,
      });
    })
  );

  // Render the app.
  renderApp();

  // The user should be treated as logged out.
  expect(
    await screen.findByRole("link", { name: /login/i })
  ).toBeInTheDocument();
});
});