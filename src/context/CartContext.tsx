import { createOrder } from "../services/orderService";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { CartItem } from "../types/CartItem";
import type { Product } from "../types/Product";

const STORAGE_KEY ="cart";

//How long the "add to cart" notification stays visible.
const NOTIFICATION_DURATION_MS = 3000;

function loadCart():CartItem[]{
    try{
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if(!raw) return [];
        const parsed: unknown = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as CartItem[]) :[];
    } catch {
        return []
    }
}

type CartContextValue = {
    items: CartItem[];
    isOpen: boolean;
    totalCount: number;
    totalPrice: number;
    // message shown in the notification
    notification: string | null;
    addToCart:(product: Product, quantity: number) => void;
    // + / - buttons and clear button 
    increaseQuantity:(productId: number) => void;
    decreaseQuantity: (productId: number) => void;
    clearCart:() => void;
    toggleCart:()=> void;
    closeCart:()=> void;
    placeOrder: () => Promise<void>;
};


const CartContext = createContext<CartContextValue | undefined > (undefined);

export function CartProvider({ children }:{children: ReactNode}){


    const [items, setItems] = useState<CartItem[]>(loadCart);
    const [isOpen, setIsOpen] = useState(false);


    // Notification state and a timer reference
    const [notification, setNotification] = useState<string | null>(null);
    const notificationTimer = useRef<number | undefined>(undefined);


    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);


    // Stop a pending timer if the provider is removed.
    useEffect(() =>{
        return () => window.clearTimeout(notificationTimer.current);
    }, []);

    function showNotification(message: string) {
        setNotification(message);
        window.clearTimeout(notificationTimer.current);
        notificationTimer.current = window.setTimeout(
            () => setNotification(null),
            NOTIFICATION_DURATION_MS
        );
    }

    function addToCart( product: Product, quantity: number){

        const inCart = 
        items.find((item) => item.product.id === product.id)?.quantity ?? 0;
        const amountToAdd = Math.min(quantity, product.stock - inCart);

        if( amountToAdd <= 0) {
            showNotification(
                ` All ${product.stock} available ${product.name} are already in your cart. `,
            );
            return;
        }

        setItems((prevItems) => {
            const existing = prevItems.find((item) => item.product.id === product.id);

            if (existing) {
                return prevItems.map((item) =>
                item.product.id === product.id
            ? {...item, quantity: item.quantity + quantity}
            : item,
        );
            }
        return [...prevItems, { product, quantity }];

        });
        
        showNotification(
            amountToAdd <quantity
            ? `${amountToAdd} x ${product.name} added to cart ( stock limit reached)`
            : `${amountToAdd} x ${product.name} added to cart`,
        );
    };

    function increaseQuantity(productId:number) {
        setItems((prevItems) =>
        prevItems.map((item) =>
        item.product.id === productId
    ? {
        ...item,
        quantity: Math.min(item.quantity +1, item.product.stock),
    }
    : item,
        ),
        );      
    }

    function decreaseQuantity( productId: number) {
        setItems((prevItems) => 
        prevItems.flatMap((item) => {
            if ( item.product.id !== productId) return [item];
            if(item.quantity <= 1) return [];
            return [{...item, quantity: item.quantity -1}];
        }),
    );
    }

    function clearCart() {
        setItems([]);
    }

    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price*item.quantity,
        0,
    );

    function toggleCart(){
        setIsOpen((prev) => !prev);
    }

    function closeCart(){
        setIsOpen(false);
    }

    //make order
    async function placeOrder() {

    if (items.length === 0) return;

    const orderRequest = {
        items: items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
        })),
    };

    await createOrder(orderRequest);

    //Clear the cart after a successful order.
    setItems([]);
}
    const value: CartContextValue = {
        items, 
        isOpen,
        totalCount,
        totalPrice,
        notification,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        toggleCart,
        closeCart,
        placeOrder,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart(): CartContextValue {
    const context = useContext(CartContext);

    if (context === undefined){
        throw new Error ("useCart must be used inside a <CartProvider>");
    }

    return context;
};