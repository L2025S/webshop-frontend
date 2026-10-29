import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import App from "../App";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { mockUsers, mockProducts } from "../mocks/data";

function renderApp() {
  return render(
    // Render the Application within a MemoryRouter to simulate routing in tests.
    // The initial route is set to "/products" to test the products page.
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
      http.get("*/appusers/me", () => {
        // Mock handler for fetching the authenticated user.
        return HttpResponse.json(mockUsers);
      }),

      http.get("*/products/all", () => {
        // Mock handler for fetching all products.
        return HttpResponse.json(mockProducts);
      }),
      http.get("*/gateway/categories/all", () => {
        // Mock handler for fetching all categories.
        return HttpResponse.json([]);
      }),
    );
    // Render the Application with the mocked API responses.
    renderApp();

    // Wait for the product name to appear in the document.
    // Verify that the product name from the mocked products is displayed correctly in the UI.
    expect(await screen.findByText(mockProducts[0].name)).toBeInTheDocument();
  });

  it("Displays an error message when the products API fails", async () => {
    // Simulate a successful response from the user API.
    server.use(
      http.get("*/appusers/me", () => {
        return HttpResponse.json(mockUsers);
      }),
      // Simulate a failure response from the products API.
      http.get("*/products/all", () => {
        return HttpResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        );
      }),
      // Simulate a successful response from the categories API.
      http.get("*/gateway/categories/all", () => {
        return HttpResponse.json([]);
      }),
    );
    // Render the Application with the mocked API responses.
    renderApp();
    // Wait for the error message to appear in the document.
    // Verify that the error message is displayed correctly in the UI when the products API fails.
    expect(
      await screen.findByText(/failed to load products \(status code: 500\)/i),
    ).toBeInTheDocument();
  });
    it("Displays an error message when the products API fails", async () => {
    // Simulate a successful response from the user API.
    server.use(
      http.get("*/appusers/me", () => {
        return HttpResponse.json(mockUsers);
      }),
      // Simulate a failure response from the products API.
      http.get("*/products/all", () => {
        return HttpResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        );
      }),
      // Simulate a successful response from the categories API.
      http.get("*/gateway/categories/all", () => {
        return HttpResponse.json([]);
      }),
    );
    // Render the Application with the mocked API responses.
    renderApp();
    // Wait for the error message to appear in the document.
    // Verify that the error message is displayed correctly in the UI when the products API fails.
    expect(
      await screen.findByText(/failed to load products \(status code: 500\)/i),
    ).toBeInTheDocument();
    it("shows Logout for a logged in user", async () => {
    // Mock a successful response from the gateway.
    // This means the user is still logged in.
    server.use(
      http.get("*/gateway/auth/me", () => {
        return HttpResponse.json({
          username: "testuser",
          roles: ["USER"],
        });
      })
    );

    // Render the application.
    renderApp();

    // Check that Logout is shown when the user is logged in.
    expect(
      await screen.findByRole("button", { name: /logout/i })
    ).toBeInTheDocument();
    });


    it("shows Login for a logged out user", async () => {
      // Mock a 401 response from the gateway.
      // 401 means the user is not logged in or the token is invalid.
      server.use(
       http.get("*/gateway/auth/me", () => {
        return new HttpResponse(null, {
          status: 401,
        });
      })
    );

    // Render the application.
    renderApp();

    // Check that Login is shown when the user is logged out.
    expect(
      await screen.findByRole("link", { name: /login/i })
    ).toBeInTheDocument();
    });
  });
  
});
