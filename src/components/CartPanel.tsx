import type { CartItem } from "../types/CartItem";
import "./CartPanel.css"

type CartPanelProps = {
    items: CartItem[];
    isOpen: boolean;
    onClose:()=>void;
};

export default function CartPanel ({items, isOpen, onClose}: CartPanelProps) {


    return (
        <aside 
        className={isOpen? "cart-panel cart-panel--open": "cart-panel"}
        aria-label="Shopping Cart"
        aria-hidden={!isOpen}>
            <div className="cart-panel__header">
            <h2 className="cart-panel__title">Cart</h2>
            <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="cart-panel__close"
            >
                ×
            </button>
            </div>

            {items.length === 0 ? (
                <p className="cart-panel__empty">Your cart is empty.</p> 
            ) : (
                <ul className="cart-pnael__list">
                    {items.map(({product, quantity})=> (
                        <li key={product.id} className="cart-panel__item">
                            <span className="cart-panel__item-name">{product.name}</span>
                            <span className="cart-pnael__item-qty">× {quantity}</span>
                        </li>
                    ))}
                </ul>
            )
            }
        </aside>
    );
};