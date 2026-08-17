import { createContext, useEffect, useReducer, useState, type ReactNode  } from "react";

import type { Product } from "../types/Product";
import { useAuth } from "../hooks/useAuth";

import {
    cartReducer,
    initialCartState,
} from "../reducers/cartReducer";

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
        undefined
    );

type CartProviderProps = {
    children: ReactNode;
};

export function CartProvider({
    children,
}: CartProviderProps) {
    const {
        user,
        loading: authLoading,
    } = useAuth();

    const [state, dispatch] = useReducer(
        cartReducer,
        initialCartState
    );

    const [
        loadedStorageKey,
        setLoadedStorageKey,
    ] = useState<string | null>(null);

    const storageKey = user
        ? `cart-${user.uid}`
        : "cart-guest";

    // Cargar carrito guardado
    useEffect(() => {
        if (authLoading) return;

        try {
            const savedCart =
                localStorage.getItem(storageKey);

            if (!savedCart) {
                dispatch({
                    type: "SET_ITEMS",
                    items: [],
                });

                setLoadedStorageKey(storageKey);
                return;
            }

            const parsedCart = JSON.parse(savedCart);

            dispatch({
                type: "SET_ITEMS",
                items: Array.isArray(parsedCart)
                    ? parsedCart
                    : [],
            });
        } catch {
            dispatch({
                type: "SET_ITEMS",
                items: [],
            });
        }

        setLoadedStorageKey(storageKey);
    }, [storageKey, authLoading]);

    // Guardar carrito cada vez que cambia
    useEffect(() => {
        if (
            authLoading ||
            loadedStorageKey !== storageKey
        ) {
            return;
        }

        localStorage.setItem(
            storageKey,
            JSON.stringify(state.items)
        );
    }, [
        state.items,
        storageKey,
        authLoading,
        loadedStorageKey,
    ]);

    const addItem = (product: Product) => {
        dispatch({
            type: "ADD_ITEM",
            product,
        });
    };

    const removeItem = (
        productId: string
    ) => {
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
            value={{
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