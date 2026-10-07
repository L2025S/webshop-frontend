
import { useState } from "react";
import { useCart } from "../context/CartContext";
import "../styles/CartPanel.css"
import { ApiError } from "../errors/ApiError";


const formatPrice = (value: number ) =>
    new Intl.NumberFormat("en-SE", {style: "currency", currency: "SEK"}).format(
        value,
    );

function getErrorMessage(err: unknown): string {
    if( err instanceof Error) {
        return err.message;
    }
    return "Something went wrong. Please try again.";
}

export default function CartPanel () {

    const {items, isOpen, closeCart, placeOrder, totalPrice } = useCart();

    const[loading, setLoading] = useState(false);
    const[error, setError] = useState<string | null> (null);
    const [orderPlaced, setOrderPlaced] = useState(false);


    async function handleConfirm(){
        setLoading(true);
        setError(null);
        setOrderPlaced(false);

        try {
            await placeOrder();
            setOrderPlaced(true);

        } catch (err) {
            if( err instanceof ApiError && ( err.status === 401 || err.status === 403)) {
                setError("You need to be logged in to place an order.");
            } else {
                setError(getErrorMessage(err));
            }
        } finally {
            setLoading(false);
        }
    }


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
                orderPlaced ? (
                    <p className="cart-panel__success" role="status">
                        Thank you! Your order has been placed.
                    </p>
                ):(
                <p className="cart-panel__empty">Your cart is empty.</p> 
            ) ): (<>
                <ul className="cart-panel__list">
                    {items.map(({product, quantity})=> (
                        <li key={product.id} className="cart-panel__item">
                            <span className="cart-panel__item-name">{product.name}</span>
                            <span className="cart-panel__item-qty">
                                {formatPrice(product.price)} × {quantity}
                            </span>
                            <span className="cart-panel__item-total">
                            {formatPrice(product.price*quantity)}
                            </span>
                        </li>
                    ))}
                </ul>

                <p className="cart-panel__total">Total: {formatPrice(totalPrice)} </p>
                {error && (
                    <p className="cart-panel__error" role="alert">
                        Order failed : {error}
                    </p>
                )}
                
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={loading}
                    className="cart-panel__confirm"
                    >
                        {loading ? "Placing order ..." : "Place order"}
                    </button>
                </>
            )
            }
        </aside>
    );
};




