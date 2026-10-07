export default function CartNotification() {
    const { notification } = useCart();

    if (!notification) return null;

    return (
        <div className="cart-notification" role="status" aria-live="polite">
            {notification}
        </div>
    )
}