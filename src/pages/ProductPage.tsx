import { useEffect, useState } from "react";
import { fetchAllProducts  } from "../services/productService";
import { ApiError } from "../errors/ApiError";
import type { Product } from "../types/Product";

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

    // State 1: loading

    if (loading) {
        return <p>Loading products...</p>;
    }

    // State 2: error
    if (error) {
        return <p style={{ color: "red" }}>{error}</p>;
    }


    // State 3: empty result
    if (products.length === 0) {
        return <p>No products available.</p>;
    }

    // State 4: display product list
    return ( 
    <div>
        <h1>Products</h1>
        <ul>{products.map((product) => (
            <li key={product.id}>
                <strong>{product.name}</strong> - ${product.price}
                <br />
                {product.description}
                <br />
                Stock: {product.stock}
            </li>
            ))}
        </ul>
    </div>
    );
};