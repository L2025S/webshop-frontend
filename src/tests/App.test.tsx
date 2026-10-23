import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import App from "../App";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { mockUsers, mockProducts } from "../mocks/data";

function renderApp() {
  return render(
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>,
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
});
