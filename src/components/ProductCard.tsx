import type { Product } from "../types/Product";
import "./ProductCard.css";

type ProductCardProps = {
    product: Product;
}

export default function ProductCard({product}: ProductCardProps){
    const isOutOfStock = product.stock === 0;

    return(
        <li className="product-card">
            <span className="product-card_tag">${product.price}</span>
            <h2 className="product-card_name">{product.name}</h2>
            <p className="product-card_description">{product.description}</p>
            <div className="product-card_footer">
                <span className={isOutOfStock ? "product-card_stock-out" : ""}>
                    {isOutOfStock ? "Out of Stock" : `${product.stock} in stock`}
                </span>
            </div>
        </li>
    );
};