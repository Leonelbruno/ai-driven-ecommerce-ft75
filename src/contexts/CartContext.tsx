import { createContext, useReducer, type ReactNode } from "react";
import type { Product } from "../types/Product";
import { cartReducer, initialCartState } from "../reducers/cartReducer";

type CartContextType = {
    items: typeof initialCartState.items;
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (
        productId: string,
        quantity: number
    ) => void;
    clearCart: () => void;
};

export const CartContext =
    createContext<CartContextType | undefined>(
        undefined //Sí lo que llama esta dentro del CartProvider recibimos el value (que esta mas abajo en el return), sino undefined
    );

type CartProviderProps = {
    children: ReactNode;
};

export function CartProvider({
    children,
}: CartProviderProps) {
    const [state, dispatch] = useReducer(
        cartReducer,// Dispatch: Despachar/Enviar una accion al reducer
        initialCartState
    );

    const addItem = (product: Product) => {
        dispatch({
            type: "ADD_ITEM",
            product,
        });
    };

    const removeItem = (productId: string) => {
        dispatch({
            type: "REMOVE_ITEM",
            productId,
        });
    };

    const updateQuantity = (
        productId: string,
        quantity: number
    ) => {
        dispatch({
            type: "UPDATE_QUANTITY",
            productId,
            quantity,
        });
    };

    const clearCart = () => {
        dispatch({
            type: "CLEAR_CART",
        });
    };

    return ( 
        <CartContext.Provider
            value={{ //Aqui indicamos que es lo que comparte CartContext
                items: state.items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}