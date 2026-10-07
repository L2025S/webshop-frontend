import { createOrder } from "../services/orderService";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem } from "../types/CartItem";
import type { Product } from "../types/Product";

const STORAGE_KEY ="cart";

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
    addToCart:(product: Product, quantity: number) => void;
    toggleCart:()=> void;
    closeCart:()=> void;
    placeOrder: () => Promise<void>;
};


const CartContext = createContext<CartContextValue | undefined > (undefined);

export function CartProvider({ children }:{children: ReactNode}){


    const [items, setItems] = useState<CartItem[]>(loadCart);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    function addToCart( product: Product, quantity: number){
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
    };

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
        addToCart,
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