import { useEffect, useState } from "react";
import { fetchAllProducts } from "../services/productService";
import type { Product } from "../types/Product";
import "../styles/ProductPage.css";
import "../styles/ProductCard.css";
import { ApiError } from "../errors/ApiError";
import ProductForm from "../components/ProductForm";

export default function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [error, setError] = useState<string | null>(null);

  // Loads all products when the page opens
  useEffect(() => {

    async function loadProducts() {
      try {
      const data = await fetchAllProducts();
      setProducts(data);
      } catch ( loadError){
        if (loadError instanceof ApiError) {
          setError ( loadError.message);
        } else {
          setError ("An unexpected error occurred. Please try again later.");
        }
      }
    }

    loadProducts();
  }, []);

  // Add this handler, passed to the firm as onProductCreated. After a successful create, the list should update without reloading the page.
  // The new product appears first in the list. currentProducts is the latest list
  // so two quick creattions cannot overwrite each other.
  function handleProductCreated( createdProduct: Product) {
    setProducts((currentProducts) => [createdProduct, ...currentProducts]);
  }

  return (
    <div className="product-page">

      <h1 className="product-page__heading">
        Admin Products
      </h1>

      {/* Add the form above the product list. */}
      <ProductForm onProductCreated={handleProductCreated} />

      {/* Show the load error using the existing status classes. The message is styled like the errors on ProductPage. */}
      {error && (
        <p className="product-page__status product_page__status--error">
          {error}
        </p>
      )}

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