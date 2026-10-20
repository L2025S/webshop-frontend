import { useEffect, useState } from "react";
import { fetchAllProducts, deleteProduct, increaseProductStock, decreaseProductStock } from "../services/productService";
import type { Product } from "../types/Product";
import "../styles/ProductPage.css";
import "../styles/ProductCard.css";
import "../styles/AdminPage.css";
import { ApiError } from "../errors/ApiError";
import ProductForm from "../components/ProductForm";


export default function AdminProductPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [stockValue, setStockValue] = useState(0);

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

  async function handleDelete(product: Product) {
  try {
    await deleteProduct(product.id);

    setProducts((currentProducts) =>
      currentProducts.filter(
        (currentProduct) => currentProduct.id !== product.id
      )
    );
  } catch (error) {
    console.error(error);
  }
  
}
function handleEditStock(product: Product) {
  setEditingProductId(product.id);
  setStockValue(product.stock);
}
async function handleStockSave(product: Product) {
  if (stockValue < 0) {
    return;
  }

  if (stockValue === product.stock) {
    setEditingProductId(null);
    return;
  }

  try {
    let updatedProduct: Product;

    if (stockValue > product.stock) {
      const quantity = stockValue - product.stock;

      updatedProduct = await increaseProductStock(
        product.uuid,
        quantity
      );
    } else {
      const quantity = product.stock - stockValue;

      updatedProduct = await decreaseProductStock(
        product.uuid,
        quantity
      );
    }

    setProducts((currentProducts) =>
      currentProducts.map((currentProduct) =>
        currentProduct.id === product.id
          ? updatedProduct
          : currentProduct
      )
    );

    setEditingProductId(null);

  } catch (error) {
    console.error(error);
  }
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
          <li className="product-card admin-product-card" key={product.id}>
            <button
              type="button"
              className="admin-product-card__delete"
              onClick={() => handleDelete(product)}
            >
            Delete
            </button>

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
            {editingProductId === product.id ? (
              <div className="admin-stock-edit">

                <input
                  type="number"
                  min="0"
                  value={stockValue}
                  onChange={(event) =>
                    setStockValue(Number(event.target.value))
                  }
                />

                <button
                  type="button"
                  onClick={() => handleStockSave(product)}
                >
                  Save
                </button>

              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleEditStock(product)}
              >
              Edit Stock
            </button>
          )}

          </li>
        ))}

      </ul>

    </div>
  );
}