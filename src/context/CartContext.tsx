import { createContext, useContext, useState, type ReactNode } from "react";
import type { CartItem } from "../types/CartItem";
import type { Product } from "../types/Product";

type CartContextValue = {
    items: CartItem[];
    isOpen: boolean;
    totalCount: number;
    addToCart:(product: Product, quantity: number) => void;
    toggleCart:()=> void;
    closeCart:()=> void;
};


const CartContext = createContext<CartContextValue | undefined > (undefined);

export function CartProvider({ children }:{children: ReactNode}){

    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

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

    function toggleCart(){
        setIsOpen((prev) => !prev);
    }

    function closeCart(){
        setIsOpen(false);
    }

    const value: CartContextValue = {
        items, 
        isOpen,
        totalCount,
        addToCart,
        toggleCart,
        closeCart,
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