import { createContext, useState, type ReactNode } from "react";
import type { Product } from "../types/Product";

type ProductsContextType = {
    products: Product[];
    loading: boolean;
    error: string | null;
};

export const ProductsContext =
    createContext <ProductsContextType | undefined> (undefined);

type ProductsProviderProps = {
    children: ReactNode;
};

const mockProducts: Product[] = [
    {
        id: "p1",
        name: "Zapatillas Runner Pro",
        description: "Zapatillas deportivas para running.",
        price: 85000,
        categoryId: "zapatillas",
        stock: 10,
    },
    {
        id: "p2",
        name: "Mochila Ergonómica",
        description: "Mochila cómoda para uso diario.",
        price: 45000,
        categoryId: "mochilas",
        stock: 8,
    },
    {
        id: "p3",
        name: "Auriculares ANC",
        description: "Auriculares con cancelación de ruido.",
        price: 120000,
        categoryId: "audio",
        stock: 5,
    },
];

export function ProductsProvider({ children }: ProductsProviderProps) {
    const [products] = useState<Product[]>(mockProducts);

    const [loading] = useState(false);

    const [error] = useState<string | null>(null);

    return (
        <ProductsContext.Provider value={{ products, loading, error }}>
            {children}
        </ProductsContext.Provider>
    );
}