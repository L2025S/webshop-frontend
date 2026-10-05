
import { useCart } from "../context/CartContext";
import "../styles/CartPanel.css"



export default function CartPanel () {

    const {items, isOpen, closeCart } = useCart();


    return (
        <aside 
        className={isOpen? "cart-panel cart-panel--open": "cart-panel"}
        aria-label="Shopping Cart"
        aria-hidden={!isOpen}>
            <div className="cart-panel__header">
            <h2 className="cart-panel__title">Cart</h2>
            <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="cart-panel__close"
            >
                ×
            </button>
            </div>

            {items.length === 0 ? (
                <p className="cart-panel__empty">Your cart is empty.</p> 
            ) : (
                <ul className="cart-panel__list">
                    {items.map(({product, quantity})=> (
                        <li key={product.id} className="cart-panel__item">
                            <span className="cart-panel__item-name">{product.name}</span>
                            <span className="cart-panel__item-qty">× {quantity}</span>
                        </li>
                    ))}
                </ul>
            )
            }
        </aside>
    );
};