import type { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { ProductsProvider } from "./ProductsContext";
import { CartProvider } from "./CartContext";

type AppProvidersProps = {
    children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <AuthProvider>
            <ProductsProvider>
                <CartProvider>
            {children}
                </CartProvider>
            </ProductsProvider>
        </AuthProvider>
    );
}