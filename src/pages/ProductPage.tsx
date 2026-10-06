import { useEffect, useState } from "react";
import { fetchAllProducts  } from "../services/productService";
import { ApiError } from "../errors/ApiError";
import type { Product } from "../types/Product";
import ProductCard from "../components/ProductCard";
import "../styles/ProductPage.css";
import { useCart } from "../context/CartContext";


export default function ProductPage (){

    const { addToCart } = useCart();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null> (null);
    const [search, setSearch] = useState("");

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


    const filteredProducts = products.filter((product) => 
        product.name.toLowerCase().includes(search.toLowerCase()) 
    );

   
    return ( 
    <div className="product-page">
        
        <div className="product-page__top"> 
            <h1 className="product-page__heading">Products</h1> 
            
            <div className="product-page__search"> 
                <i className="fa fa-search product-page__search-icon"></i> 
                
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    value={search} 
                    onChange={(event) => setSearch(event.target.value)} 
                /> 
            </div> 
        </div>

        {!loading && !error && (
            <p className="product-page__count">
                {filteredProducts.length} 
                {filteredProducts.length === 1 ? "product" : "products"} available
            </p>
        )}

        {loading && (
            <p className="product-page__status">Loading products...</p>
        )}

        {!loading && error && (
            <p className="product-page__status product-page__status--error">
                {error}
            </p>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
            <p className="product-page__status product-page__status--empty">
                {search
                    ? `No products found for "${search}".`
                    : "No products available right now. Check back soon."}
            </p>
        )} 

        {!loading && !error && filteredProducts.length > 0 && (
            <ul className="product-grid">
                {filteredProducts.map((product) => (
                    <ProductCard 
                    key={product.id} 
                    product={product}
                    onAddToCart={addToCart} />
                ))}
            </ul>
        )}

    </div>
    );
};