import {
    useEffect,
    useState,
} from "react";

import { Link } from "react-router";

import { useAuth } from "../hooks/useAuth";
import { getUserOrders } from "../services/orderService";

import type { Order } from "../types/Order";

export function OrdersPage() {
    const { user } = useAuth();

    const [orders, setOrders] =
        useState<Order[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        if (!user) return;

        const loadOrders = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getUserOrders(
                        user.uid
                    );

                setOrders(data);
            } catch (error) {
                console.error(
                    "Error cargando órdenes:",
                    error
                );

                setError(
                    "No se pudieron cargar tus pedidos"
                );
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [user]);

    return (
        <main className="min-h-screen bg-[var(--background)] px-4 py-10">
            <div className="mx-auto max-w-4xl">
                <Link
                    to="/"
                    className="font-semibold text-[var(--pacific-cyan)]"
                >
                    ← Volver al catálogo
                </Link>

                <div className="mt-6">
                    <h1 className="text-3xl font-black text-[var(--charcoal-blue)]">
                        Mis pedidos
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Consultá tu historial de compras.
                    </p>
                </div>

                {loading && (
                    <div className="mt-8 rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
                        Cargando pedidos...
                    </div>
                )}

                {error && (
                    <div className="mt-8 rounded-xl bg-red-50 p-5 text-red-700">
                        {error}
                    </div>
                )}

                {!loading &&
                    !error &&
                    orders.length === 0 && (
                        <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
                            <h2 className="text-xl font-bold text-[var(--charcoal-blue)]">
                                Todavía no tenés pedidos
                            </h2>

                            <Link
                                to="/"
                                className="mt-5 inline-block rounded-lg bg-[var(--charcoal-blue)] px-5 py-3 font-bold text-white"
                            >
                                Ir al catálogo
                            </Link>
                        </div>
                    )}

                <section className="mt-8 space-y-5">
                    {orders.map((order) => (
                        <article
                            key={order.id}
                            className="rounded-2xl bg-white p-6 shadow-sm"
                        >
                            <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Orden
                                    </p>

                                    <p className="break-all font-semibold text-[var(--charcoal-blue)]">
                                        {order.id}
                                    </p>
                                </div>

                                <span className="w-fit rounded-full bg-[var(--tea-green)] px-3 py-1 text-sm font-bold text-[var(--charcoal-blue)]">
                                    {order.status}
                                </span>
                            </div>

                            <div className="mt-5 space-y-3">
                                {order.items.map(
                                    (item) => (
                                        <div
                                            key={
                                                item.productId
                                            }
                                            className="flex justify-between gap-4"
                                        >
                                            <div>
                                                <p className="font-semibold">
                                                    {item.name}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    Cantidad:{" "}
                                                    {item.quantity}
                                                </p>
                                            </div>

                                            <p className="font-semibold">
                                                $
                                                {(
                                                    item.priceAtPurchase *
                                                    item.quantity
                                                ).toLocaleString(
                                                    "es-AR"
                                                )}
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="mt-5 flex flex-col gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-gray-500">
                                    {order.createdAt
                                        ? order.createdAt.toLocaleString(
                                            "es-AR"
                                        )
                                        : "Fecha no disponible"}
                                </p>

                                <p className="text-xl font-black text-[var(--charcoal-blue)]">
                                    Total: $
                                    {order.total.toLocaleString(
                                        "es-AR"
                                    )}
                                </p>
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </main>
    );
}   