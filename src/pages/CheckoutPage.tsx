import { useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router";

import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { createOrder } from "../services/orderService";

export function CheckoutPage() {
    const { user } = useAuth();

    const {
        items,
        clearCart,
    } = useCart();

    const navigate = useNavigate();

    const [processing, setProcessing] =
        useState(false);

    const [error, setError] =
        useState("");

    const total = items.reduce(
        (acc, item) =>
            acc +
            item.product.price *
            item.quantity,
        0
    );

    const handleCheckout = async () => {
        if (!user || items.length === 0) {
            return;
        }

        try {
            setProcessing(true);
            setError("");

            const orderId =
                await createOrder(
                    user.uid,
                    items,
                    total
                );

            clearCart();

            navigate(
                `/orders/${orderId}/success`
            );
        } catch (error) {
            console.error(
                "Error al crear orden:",
                error
            );

            setError(
                "No se pudo completar la compra"
            );
        } finally {
            setProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
                <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                    <h1 className="text-3xl font-black text-[var(--charcoal-blue)]">
                        Checkout
                    </h1>

                    <p className="mt-3 text-gray-500">
                        No hay productos en el carrito.
                    </p>

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
            <div className="mx-auto max-w-4xl">
                <Link
                    to="/cart"
                    className="font-semibold text-[var(--pacific-cyan)]"
                >
                    ← Volver al carrito
                </Link>

                <h1 className="mt-6 text-3xl font-black text-[var(--charcoal-blue)]">
                    Checkout
                </h1>

                <p className="mt-2 text-gray-500">
                    Confirmá tu compra antes de finalizar.
                </p>

                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
                    <section className="rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-[var(--charcoal-blue)]">
                            Productos
                        </h2>

                        <div className="mt-5 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.product.id}
                                    className="flex justify-between border-b border-gray-100 pb-4"
                                >
                                    <div>
                                        <p className="font-semibold">
                                            {item.product.name}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Cantidad:{" "}
                                            {item.quantity}
                                        </p>
                                    </div>

                                    <span className="font-semibold">
                                        $
                                        {(
                                            item.product.price *
                                            item.quantity
                                        ).toLocaleString(
                                            "es-AR"
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="font-bold text-[var(--charcoal-blue)]">
                            Resumen de compra
                        </h2>

                        <p className="mt-3 text-sm text-gray-500">
                            {user?.email}
                        </p>

                        <div className="my-5 border-t border-gray-200" />

                        <div className="flex justify-between text-lg">
                            <span>Total</span>

                            <strong>
                                $
                                {total.toLocaleString(
                                    "es-AR"
                                )}
                            </strong>
                        </div>

                        {error && (
                            <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        <button
                            onClick={handleCheckout}
                            disabled={processing}
                            className="mt-6 w-full rounded-lg bg-[var(--charcoal-blue)] px-4 py-3 font-bold text-white hover:bg-[var(--dark-slate-grey)] disabled:bg-gray-400"
                        >
                            {processing
                                ? "Procesando..."
                                : "Confirmar compra"}
                        </button>
                    </aside>
                </div>
            </div>
        </main>
    );
}