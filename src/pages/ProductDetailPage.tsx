import { useRef, useState } from "react";
import { Link, useParams } from "react-router";

import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";

export function ProductDetailPage() {
    const { productId } = useParams();

    const {
        products,
        loading,
        error,
    } = useProducts();

    const { addItem } = useCart();

    const [cartMessage, setCartMessage] = useState("");

    const messageTimeout =
        useRef<number | null>(null);

    const product = products.find(
        (product) => product.id === productId
    );

    const handleAddToCart = () => {
        if (!product) return;

        addItem(product);

        setCartMessage(
            `${product.name} agregado al carrito`
        );

        if (messageTimeout.current) {
            window.clearTimeout(
                messageTimeout.current
            );
        }

        messageTimeout.current =
            window.setTimeout(() => {
                setCartMessage("");
            }, 2000);
    };

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
                <p className="text-gray-500">
                    Cargando producto...
                </p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
                <div className="rounded-xl bg-red-50 p-6 text-red-700">
                    {error}
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
                <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                    <h1 className="text-2xl font-black text-[var(--charcoal-blue)]">
                        Producto no encontrado
                    </h1>

                    <Link
                        to="/"
                        className="mt-6 inline-block rounded-lg bg-[var(--charcoal-blue)] px-5 py-3 font-bold text-white"
                    >
                        Volver al catálogo
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--background)] px-4 py-10">
            <div className="mx-auto max-w-5xl">
                <Link
                    to="/"
                    className="font-semibold text-[var(--pacific-cyan)]"
                >
                    ← Volver al catálogo
                </Link>

                <article className="mt-8 grid overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-2">
                    <div className="flex min-h-80 items-center justify-center bg-gray-100">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-full max-h-[520px] w-full object-cover"
                            />
                        ) : (
                            <span className="text-gray-400">
                                Sin imagen
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col p-6 sm:p-8">
                        <span className="text-sm font-bold uppercase tracking-wide text-[var(--pacific-cyan)]">
                            {product.categoryId}
                        </span>

                        <h1 className="mt-3 text-3xl font-black text-[var(--charcoal-blue)]">
                            {product.name}
                        </h1>

                        <p className="mt-5 leading-7 text-gray-600">
                            {product.description}
                        </p>

                        <div className="mt-8">
                            <p className="text-3xl font-black text-[var(--charcoal-blue)]">
                                $
                                {product.price.toLocaleString(
                                    "es-AR"
                                )}
                            </p>

                            <p className="mt-2 text-sm text-gray-500">
                                Stock disponible:{" "}
                                {product.stock}
                            </p>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock <= 0}
                            className="mt-8 rounded-lg bg-[var(--charcoal-blue)] px-5 py-3 font-bold text-white hover:bg-[var(--dark-slate-grey)] disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            {product.stock > 0
                                ? "Agregar al carrito"
                                : "Sin stock"}
                        </button>
                    </div>
                </article>
            </div>
            {cartMessage && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[var(--charcoal-blue)] px-5 py-3 font-semibold text-white shadow-xl"
                >
                    ✓ {cartMessage}
                </div>
            )}
        </main>
    );
}