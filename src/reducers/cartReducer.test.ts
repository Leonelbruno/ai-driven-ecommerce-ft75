import { describe, expect, it } from "vitest";
import { cartReducer, initialCartState } from "./cartReducer";
import type { Product } from "../types/Product";

const product: Product = {
    id: "product-1",
    name: "Producto Test",
    description: "Producto para testing",
    price: 1000,
    categoryId: "test",
    stock: 2,
};

describe("cartReducer", () => {
    it("agrega un producto nuevo al carrito", () => {
        const state = cartReducer(
            initialCartState,
            {
                type: "ADD_ITEM",
                product,
            }
        );

        expect(state.items).toHaveLength(1);

        expect(
            state.items[0].quantity
        ).toBe(1);
    });

    it("aumenta la cantidad si el producto ya existe", () => {
        const firstState = cartReducer(
            initialCartState,
            {
                type: "ADD_ITEM",
                product,
            }
        );

        const secondState = cartReducer(
            firstState,
            {
                type: "ADD_ITEM",
                product,
            }
        );

        expect(
            secondState.items[0].quantity
        ).toBe(2);
    });

    it("no permite superar el stock", () => {
        const state = {
            items: [
                {
                    product,
                    quantity: 1,
                },
            ],
        };

        const result = cartReducer(
            state,
            {
                type: "UPDATE_QUANTITY",
                productId: product.id,
                quantity: 20,
            }
        );

        expect(
            result.items[0].quantity
        ).toBe(2);
    });
});