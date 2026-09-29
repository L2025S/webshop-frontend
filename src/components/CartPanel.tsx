import type { CartItem } from "../types/CartItem";

type CartPanelProps = {
    items: CartItem[];
    isOpen: boolean;
    onClose:()=>void;
};

export default function CartPanel ({items, isOpen, onClose}: CartPanelProps) {

    if(!isOpen) return null;

    return (
        <aside className="cart-panel" arial-label="Shopping Cart">
            <div className="cart-panel_header">
            <h2 className="cart-panel_title">Cart</h2>
            <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            >
                ×
            </button>
            </div>

            {items.length === 0 ? (
                <p className="cart-panel_empty">Your cart is empty.</p> 
            ) : (
                <ul className="cart-pnael_list">
                    {items.map(({product, quantity})=> (
                        <li key={product.id} className="cart-panel_item">
                            <span className="cart-panel_item-name">{product.name}</span>
                            <span className="cart-pnael-item-qty">× {quantity}</span>
                        </li>
                    ))}
                </ul>
            )
            }
        </aside>
    );
};