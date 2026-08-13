// 1. Imports
import type { CartItem } from "../types/CartItem";
import type { Product } from "../types/Product";

// 2. Cómo es el estado
export type CartState = {
    items: CartItem[];
};

// 3. Qué acciones existen
export type CartAction =
    | {
        type: "ADD_ITEM";
        product: Product;
    }
    | {
        type: "REMOVE_ITEM";
        productId: string;
    }
    | {
        type: "UPDATE_QUANTITY";
        productId: string;
        quantity: number;
    }
    | {
        type: "CLEAR_CART";
    };

// 4. Estado inicial
export const initialCartState: CartState = {
    items: [],
};

// 5. Lógica del reducer
export function cartReducer(
    state: CartState,
    action: CartAction
): CartState {
    switch (action.type) {
        case "ADD_ITEM": {
            const existingItem = state.items.find(
                (item) => item.product.id === action.product.id
            );

            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map((item) =>
                        item.product.id === action.product.id
                            ? {
                                ...item,
                                quantity: item.quantity + 1,
                            }
                            : item
                    ),
                };
            }

            return {
                ...state,
                items: [
                    ...state.items,
                    {
                        product: action.product,
                        quantity: 1,
                    },
                ],
            };
        }

        case "REMOVE_ITEM": {
            return {
                ...state,
                items: state.items.filter(
                    (item) =>
                        item.product.id !== action.productId
                ),
            };
        }

        case "UPDATE_QUANTITY": {
            if (action.quantity < 1) {
                return state;
            }

            return {
                ...state,
                items: state.items.map((item) =>
                    item.product.id === action.productId
                        ? {
                            ...item,
                            quantity: action.quantity,
                        }
                        : item
                ),
            };
        }

        case "CLEAR_CART": {
            return {
                items: [],
            };
        }

        default:
            return state;
    }
}