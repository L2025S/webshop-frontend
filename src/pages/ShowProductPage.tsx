import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import { fetchAllProducts } from "../services/productService";
import { useCart } from "../context/CartContext";

export default function ShowProductPage() {
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);

    // A hardcoded product ID. Change this.
    const productId = 1;

    useEffect(() => {
        async function loadProduct() {
            try {
                const products = await fetchAllProducts();

                const foundProduct = products.find(
                    (product) => product.id === productId
                );

                if (foundProduct) {
                    setProduct(foundProduct);
                } else {
                    setError("Product not found.");
                }
            } catch (error) {
                console.error(error);
                setError("Failed to load product.");
            }
        }

        loadProduct();
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    if (!product) {
        return <p>Loading product...</p>;
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
                    {product.category
                        ? product.category.name
                        : "No category"}
                </span>

                <p className="product-page_show_description">
                    {product.description}
                </p>

                <p className="product-page_show_price">
                    {product.price} SEK
                </p>

                <p
                    className={
                        isOutOfStock
                            ? "product-page_show_stock product-page_show_stock--out"
                            : "product-page_show_stock"
                    }
                >
                    {isOutOfStock
                        ? "Out of Stock"
                        : `${product.stock} in stock`}
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

