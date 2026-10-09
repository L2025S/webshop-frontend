import { useEffect, useState } from "react";
import { fetchAllProducts } from "../services/productService";
import type { Product } from "../types/Product";
import "../styles/ProductPage.css";
import "../styles/ProductCard.css";

export default function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>([]);

  // Loads all products when the page opens
  useEffect(() => {
    async function loadProducts() {
      const data = await fetchAllProducts();
      setProducts(data);
    }

    loadProducts();
  }, []);

  return (
    <div className="product-page">

      <h1 className="product-page__heading">
        Admin Products
      </h1>

      <ul className="product-grid">

        {products.map((product) => (
          <li className="product-card" key={product.id}>

            <img
              src={product.imageUrl || "/placeholder-product.png"}
              alt={product.name}
              className="product-card__image"
            />

            <h2 className="product-card__name">
              {product.name}
            </h2>

            <span
              className={
                product.category
                  ? "product-card__category"
                  : "product-card__category product-card__category--none"
              }
            >
              {product.category
                ? product.category.name
                : "No category"}
            </span>

            <p className="product-card__description">
              {product.description}
            </p>

            <span className="product-card__tag">
              {product.price} SEK
            </span>

            <div className="product-card__footer">
              <span
                className={
                  product.stock === 0
                    ? "product-card__stock product-card__stock--out"
                    : "product-card__stock"
                }
              >
                {product.stock === 0
                  ? "Out of Stock"
                  : `${product.stock} in stock`}
              </span>
            </div>

          </li>
        ))}

      </ul>

    </div>
  );
}