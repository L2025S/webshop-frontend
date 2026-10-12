import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import { fetchProduct } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useParams } from "react-router-dom";

export default function ShowProductPage() {
  const { addToCart } = useCart();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // A hardcoded product ID. Change this.
  // const productId = 1;

  useEffect(() => {
    async function loadProduct() {
      if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        setError("Invalid product ID.");
        setLoading(false);
        return;
      }

      try {
        const product = await fetchProduct(Number(id));

        if (product) {
          setProduct(product);
        } else {
          setError("Product not found.");
        }
      } catch (error) {
        console.error(error);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return <div className="product-page">Loading product...</div>;
  }

  if (error) {
    return <div className="product-page">{error}</div>;
  }

  if (!product) {
    return <div className="product-page">Product not found.</div    >;
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="product-page">
      <div className="product-page_show_image">
        <img
          src={product.imageUrl || "/placeholder-product.png"}
          alt={product.name}
        />
      </div>

      <div className="product-page_show_details">
        <h1>{product.name}</h1>

        <span className="product-page_show_category">
          {product.category ? product.category.name : "No category"}
        </span>

        <p className="product-page_show_description">{product.description}</p>

        <p className="product-page_show_price">{product.price} SEK</p>

        <p
          className={
            isOutOfStock
              ? "product-page_show_stock product-page_show_stock--out"
              : "product-page_show_stock"
          }
        >
          {isOutOfStock ? "Out of Stock" : `${product.stock} in stock`}
        </p>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={() => addToCart(product, 1)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
