
import { useState } from "react";
import { useCart } from "../context/CartContext";
import "../styles/CartPanel.css"
import { ApiError } from "../errors/ApiError";
import { useNavigate } from "react-router-dom";


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

    const {
        items, 
        isOpen, 
        closeCart, 
        placeOrder, 
        totalPrice,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
    } = useCart();

    const navigate = useNavigate();


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

    function handleClear() {
        clearCart();
        setError(null);
        setOrderPlaced(false);
    }

    function handleContinueShopping() {
        closeCart();
        navigate("/products");
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
                <>
                {orderPlaced ? (
                    <p className="cart-panel__success" role="status">
                        Thank you! Your order has been placed.
                    </p>
                ):(
                <p className="cart-panel__empty">Your cart is empty.</p> 
                )}

                <button
                type="button"
                onClick={handleContinueShopping}
                className="cart-panel__continue"
                >
                    Continue shopping
                </button>
                </>

            ) : (
                <>
                <ul className="cart-panel__list">
                    {items.map(({product, quantity})=> (
                        <li key={product.id} className="cart-panel__item">
                            <div className="cart-panel__item-row">
                                <span className="cart-panel__item-name">{product.name}</span>
                                <span>
                                    {formatPrice(product.price)} each
                                </span>

                            </div>

                            <div className="cart-pnael__item-row">
                            <div className="cart-panel__quantity">
                                <button
                                type="button"
                                onClick={() => decreaseQuantity(product.id)}
                                disabled={loading}
                                aria-label={`Decrease quantity of ${product.name}`}>
                                    -
                                </button>
                                <span className="cart-panel__quantity-value">
                                    {quantity}
                                </span>
                                <button
                                type="button"
                                onClick={() => increaseQuantity(product.id)}
                                disabled={loading || quantity >= product.stock}
                                aria-label={`Increase quantity of ${product.name}`}
                                >
                                    +
                                </button>
                            </div>

                            <span className="cart-panel__item-total">
                                Subtotal: {formatPrice(product.price*quantity)}
                            </span>
                           
                        </div>
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

                <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="cart-panel__clear">
                    Clear cart
                </button>

                <button
                type="button"
                onClick={handleContinueShopping}
                className="cart-panel__continue"
                >
                    Continue shopping
                </button>
                </>
            )}
        </aside>
    );
};




