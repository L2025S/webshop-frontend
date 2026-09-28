import { useEffect, useState } from "react";
import { fetchAllProducts  } from "../services/productService";
import { ApiError } from "../errors/ApiError";
import type { Product } from "../types/Product";
import ProductCard from "../components/ProductCard";
import "./ProductPage.css";

export default function ProductPage (){

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null> (null);

    useEffect(() => {

        async function loadProducts() {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchAllProducts();
                setProducts(data);

            } catch (error) {
                if (error instanceof ApiError) {
                    setError (error.message);
                } else {
                    setError ("An unexpected error occurred. Please try again later.");
                }
                    
            } finally {

                setLoading (false);

            }

        };

        loadProducts();
    }, []);

   
    return ( 
    <div className="product-page">
        <h1 className="product-page_heading">Products</h1>
       
        {!loading && !error && (
            <p className="product-page_count">
                {products.length} {products.length === 1 ? "product" : "products"} available
            </p>
        )}

        {loading && (
            <p className="product-page_status">Loading products...</p>
        )}

        {!loading && error && (
            <p className="product-page_status product-page_status-error">
                {error}
            </p>
        )}

        {!loading && !error && products.length === 0 &&(
            <p className="product-page_status product-page_status-empty">
                No products available right now. Check back soon.
            </p>
        )}

        {!loading && !error && products.length > 0 && (
            <ul className="product-grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </ul>
        )}

    </div>
    );
};