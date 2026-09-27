import type { Product } from "../types/Product";
import "./ProductCard.css";

type ProductCardProps = {
    product: Product;
}

export default function ProductCard({product}: ProductCardProps){
    const isOutOfStock = product.stock === 0;

    return(
        <li className="product-card">
            <h2 className="product-card_name">{product.name}</h2>
            <img 
            src={product.imageUrl ??  "/placeholder-product.png"}
            alt={product.name}
            className="product-card_image"
             />
            <p className="product-card_description">{product.description}</p>
            <span className="product-card_tag">${product.price}</span>
            <div className="product-card_footer">
                <span className={isOutOfStock ? "product-card_stock-out" : ""}>
                    {isOutOfStock ? "Out of Stock" : `${product.stock} in stock`}
                </span>
            </div>
        </li>
    );
};