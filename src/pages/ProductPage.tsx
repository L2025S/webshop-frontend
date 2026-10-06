import { useEffect, useState } from "react";
import { fetchAllProducts } from "../services/productService";
import { ApiError } from "../errors/ApiError";
import type { Product } from "../types/Product";
import type { Category } from "../types/Category";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";
import { useCart } from "../context/CartContext";
import "../styles/ProductPage.css";
import { fetchAllCategories } from "../services/categoryService";


export default function ProductPage() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Categories for the dropdown and the currently selected category filter
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  //  add a new piece of state for the search field
  const [searchTerm, setSearchTerm] = useState("");



  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchAllProducts();
        setProducts(data);
      } catch (error) {
        if (error instanceof ApiError) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await fetchAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Could not load categories:", error);
      }
    }

    loadCategories();
  }, []);


// The search term is trimmed and lower-cased once here. 
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const isSearching = normalizedSearch !== "";

  const visibleProducts =products.filter((product) => {
    const matchesCategory =
    selectedCategoryId === null || product.category?.id === selectedCategoryId;

    const matchesSearch = 
    !isSearching ||
    product.name.toLowerCase().includes(normalizedSearch) ||
    product.description.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });
   

  return (
    <div className="product-page">
      <h1 className="product-page__heading">Products</h1>


    {/* The search filed and the category filter now sit together */}
      {!loading && !error && (
        <div className="product-page__filters">
          <div className="product-page__search">
            <span className="product-page__search-icon" aria-hidden="true">
              🔍
            </span>
            <input 
            type="search" 
            placeholder="Search products..."
            aria-label="Search products by name or description"
            value={searchTerm}
            onChange={(event)=> setSearchTerm(event.target.value)}
            />
          </div>

          {categories.length > 0 && (
            <CategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onChange={setSelectedCategoryId} 
            />
          )}
        </div>
      )}

      {!loading && !error && (
        <p className="product-page__count">
          {visibleProducts.length}{" "}
          {visibleProducts.length === 1 ? "product" : "products"} available
        </p>
      )}

      {loading && <p className="product-page__status">Loading products...</p>}

      {!loading && error && (
        <p className="product-page__status product-page__status--error">
          {error}
        </p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="product-page__status product-page__status--empty">
          No products available right now. Check back soon.
        </p>
      )}



      {/* The "No results" message now depends on wheter the user is searching.*/}
      {!loading &&
        !error &&
        products.length > 0 &&
        visibleProducts.length === 0 && (
          <p className="product-page__status product-page__status--empty">
            {isSearching
            ? `No product match "${searchTerm.trim()}${
              selectedCategoryId !== null ? " in this category" :""
            }.`
            : "No products in this category."}
          </p>
        )}

      {!loading && !error && visibleProducts.length > 0 && (
        <ul className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
