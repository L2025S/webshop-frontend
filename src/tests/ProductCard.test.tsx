import { render, screen, fireEvent } from "@testing-library/react";
import {  describe, expect, it, vi } from "vitest";
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
    category:null,
    createdAt: "2026-09-25T10:00:00",
    updatedAt: "2026-09-25T10:00:00",
  };

  const onAddToCart = vi.fn<(product: Product, quantity: number) => void>();


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

  it("decreases quantity correctly", () => {
    render(<ProductCard product={product} onAddToCart={onAddToCart} />);

    const increaseButton = screen.getByRole("button", {
      name: /increase quantity/i,
    });

    const decreaseButton = screen.getByRole("button", {
      name: /decrease quantity/i,
    });
    fireEvent.click(increaseButton);
    fireEvent.click(increaseButton);

    expect(screen.getByText("3")).toBeInTheDocument();

    fireEvent.click(decreaseButton);

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("does not allow quantity above stock", () => {
    render(<ProductCard product={product} onAddToCart={onAddToCart} />);

    const increaseButton = screen.getByRole("button", {
      name: /increase quantity/i,
    });
    fireEvent.click(increaseButton);
    fireEvent.click(increaseButton);
    fireEvent.click(increaseButton);
    fireEvent.click(increaseButton);

    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("does not show quantity controls when out of stock", () => {
    const outOfStockProduct: Product = {
      ...product,
      stock: 0,
    };
    render(
      <ProductCard product={outOfStockProduct} onAddToCart={onAddToCart} />,
    );

    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /increase quantity/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /increase quantity/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /decrease quantity/i }),
    ).not.toBeInTheDocument();
  });
});
