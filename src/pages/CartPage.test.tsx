import { beforeEach, describe, expect, it, vi, } from "vitest";
import { render, screen, } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { CartProvider } from "../contexts/CartContext";
import { CartPage } from "./CartPage";

vi.mock("../hooks/useAuth", () => ({
    useAuth: () => ({
        user: {
            uid: "test-user",
            email: "test@email.com",
            role: "customer",
        },
        loading: false,
    }),
}));

describe("CartPage", () => {
    beforeEach(() => {
        localStorage.clear();

        localStorage.setItem(
            "cart-test-user",
            JSON.stringify([
                {
                    product: {
                        id: "product-1",
                        name: "Producto Test",
                        description: "Producto test",
                        price: 1000,
                        categoryId: "test",
                        stock: 3,
                    },
                    quantity: 1,
                },
            ])
        );
    });

    it("permite aumentar la cantidad del producto", async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <CartProvider>
                    <CartPage />
                </CartProvider>
            </MemoryRouter>
        );

        expect(
            await screen.findByText(
                /Cantidad: 1/i
            )
        ).toBeInTheDocument();

        const plusButton =
            screen.getByRole("button", {
                name: "+",
            });

        await user.click(plusButton);

        expect(
            screen.getByText(
                /Cantidad: 2/i
            )
        ).toBeInTheDocument();
    });
});