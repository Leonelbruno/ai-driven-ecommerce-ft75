import { createContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "../types/Product";
import { getProducts } from "../services/productService";

type ProductsContextType = {
    products: Product[];
    loading: boolean;
    error: string | null;
};

export const ProductsContext =
    createContext<ProductsContextType | undefined>(
        undefined
    );

type ProductsProviderProps = {
    children: ReactNode;
};

export function ProductsProvider({
    children,
}: ProductsProviderProps) {
    const [products, setProducts] =
        useState<Product[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await getProducts();

                setProducts(data);
            } catch (error) {
                console.error(
                    "Error al cargar productos:",
                    error
                );

                setError(
                    "No se pudieron cargar los productos"
                );
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    return (
        <ProductsContext.Provider
            value={{
                products,
                loading,
                error,
            }}
        >
            {children}
        </ProductsContext.Provider>
    );
}