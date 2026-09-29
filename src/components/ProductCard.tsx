import { useState } from "react";
import type { Product } from "../types/Product";
import "./ProductCard.css";

type ProductCardProps = {
    product: Product;
    onAddToCart:(product: Product, quantity: number) => void;
}

export default function ProductCard({product, onAddToCart}: ProductCardProps){
    const isOutOfStock = product.stock === 0;

    const [quantity, setQuantity] = useState(1);

    const safeQuantity = Math.min(quantity, product.stock);

    function decreaseQuantity(){
        setQuantity(Math.max(1, safeQuantity -1));
    }
    
    function increaseQuantity() {
        setQuantity(Math.min(product.stock, safeQuantity +1));
    }

    function handleAddToCart(){
        onAddToCart(product, safeQuantity);
        setQuantity(1);
    }

    return(
        <li className="product-card">
               <img 
            src={product.imageUrl || "/placeholder-product.png"}
            alt={product.name}
            className="product-card__image"
             />
            <h2 className="product-card__name">{product.name}</h2>
         
            <p className="product-card__description">{product.description}</p>
            <span className="product-card__tag">{product.price} SEK</span>
            <div className="product-card__footer">
                <span 
                className={
                    isOutOfStock 
                    ? "product-card__stock  product-card__stock--out"
                    : "product-card__stock"
                    }
                    >
                    {isOutOfStock ? "Out of Stock" : `${product.stock} in stock`}
                </span>
            </div>

            {!isOutOfStock && (
                <div className="product-card__quantity">
                    <div className="quantity-selector">
                    <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={safeQuantity <= 1}
                    aria-label="Decrease quantity">
                        −
                    </button>
                    <span className="quantity-selector__value">{safeQuantity}</span>
                    <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={safeQuantity >= product.stock}
                    aria-label="Increase quantity"
                    >
                        +
                    </button>
                    </div>

                    <button
                    type="button"
                    onClick={handleAddToCart}
                    className="add-to-cart__add-button"
                    >
                    ADD TO CART
                    </button>
                </div>
            )}
        </li>
    );
};