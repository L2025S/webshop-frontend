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
        return HttpResponse.json(mockUsers);
      }),

      http.get("*/products/all", () => {
        return HttpResponse.json(mockProducts);
      }),
      http.get("*/gateway/categories/all", () => {
        return HttpResponse.json([]);
      }),
    );

    renderApp();

    expect(await screen.findByText(mockProducts[0].name)).toBeInTheDocument();
  });

  it("Displays an error message when the products API fails", async () => {
    server.use(
      http.get("*/appusers/me", () => {
        return HttpResponse.json(mockUsers);
      }),
      http.get("*/products/all", () => {
        return HttpResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        );
      }),
      http.get("*/gateway/categories/all", () => {
        return HttpResponse.json([]);
      }),
    );
    renderApp();
    expect(
      await screen.findByText(/failed to load products \(status code: 500\)/i),
    ).toBeInTheDocument();
  });
});
