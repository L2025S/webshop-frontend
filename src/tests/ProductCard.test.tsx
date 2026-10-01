import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types/Product";

describe("ProductCard", () => {
  const product: Product = {
    id: 1,
    uuid: "test-uuid-123",
    name: "Test Product",
    imageUrl: null,
    price: 299,
    description: "This is a test product",
    stock: 4,
    createdAt: "2026-09-25T10:00:00",
    updatedAt: "2026-09-25T10:00:00",
  };

  const onAddToCart = vi.fn<(product: Product, quantity: number) => void>();

  beforeEach(() => {
    onAddToCart.mockClear();
  });

  it("displays product details correctly", () => {
    render(<ProductCard product={product} onAddToCart={onAddToCart} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("This is a test product")).toBeInTheDocument();
    expect(screen.getByText(/299\s*SEK/i)).toBeInTheDocument();
    expect(screen.getByText("4 in stock")).toBeInTheDocument();
  });

  it("calls onAddToCart with correct product and quantity", () => {
    render(<ProductCard product={product} onAddToCart={onAddToCart} />);

    const addButton = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addButton);

    expect(onAddToCart).toHaveBeenCalledWith(product, 1);
  });

  it("calls onAddToCart with the selected quantity", () => {
    render(<ProductCard product={product} onAddToCart={onAddToCart} />);

    const increaseButton = screen.getByRole("button", {
      name: /increase quantity/i,
    });
    fireEvent.click(increaseButton);
    fireEvent.click(increaseButton);

    const addButton = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addButton);

    expect(onAddToCart).toHaveBeenCalledWith(product, 3);
  });
});
