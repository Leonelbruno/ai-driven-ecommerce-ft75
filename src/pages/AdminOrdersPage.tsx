import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Order, OrderStatus } from "../types/Order";
import { getAllOrders, updateOrderStatus } from "../services/orderService";

export function AdminOrdersPage() {
    const [orders, setOrders] =
        useState<Order[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAllOrders();

            setOrders(data);
        } catch (error) {
            console.error(
                "Error al cargar órdenes:",
                error
            );

            setError(
                "No se pudieron cargar las órdenes"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, []);

    const handleStatusChange = async (
        orderId: string,
        status: OrderStatus
    ) => {
        try {
            setError("");

            await updateOrderStatus(
                orderId,
                status
            );

            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order.id === orderId
                        ? {
                            ...order,
                            status,
                        }
                        : order
                )
            );
        } catch (error) {
            console.error(
                "Error actualizando estado:",
                error
            );

            setError(
                "No se pudo actualizar el estado del pedido"
            );
        }
    };

    const filteredOrders =
        statusFilter === "all"
            ? orders
            : orders.filter(
                (order) =>
                    order.status === statusFilter
            );

    if (loading) {
        return <p>Cargando órdenes...</p>;
    }

    return (
        <main className="min-h-screen bg-slate-100">
            <header className="bg-[var(--charcoal-blue)] text-white shadow-md">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
                    <div>
                        <p className="text-sm font-semibold text-[var(--tea-green)]">
                            PATAGONIX TECH
                        </p>

                        <h1 className="text-2xl font-black">
                            Gestión de pedidos
                        </h1>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            to="/admin"
                            className="rounded-lg bg-white/10 px-4 py-2 font-semibold hover:bg-white/20"
                        >
                            Productos
                        </Link>

                        <Link
                            to="/"
                            className="rounded-lg bg-[var(--tea-green)] px-4 py-2 font-bold text-[var(--charcoal-blue)]"
                        >
                            Ver tienda
                        </Link>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-[var(--charcoal-blue)]">
                            Pedidos
                        </h2>

                        <p className="mt-1 text-gray-500">
                            Consultá y actualizá el estado de las órdenes.
                        </p>
                    </div>

                    <div className="w-full sm:w-60">
                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Filtrar por estado
                        </label>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[var(--pacific-cyan)]"
                        >
                            <option value="all">
                                Todos
                            </option>

                            <option value="pending">
                                Pendientes
                            </option>

                            <option value="processing">
                                En proceso
                            </option>

                            <option value="completed">
                                Completados
                            </option>

                            <option value="cancelled">
                                Cancelados
                            </option>
                        </select>
                    </div>
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
                    filteredOrders.length ===
                    0 && (
                        <div className="mt-8 rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
                            No hay pedidos para este filtro.
                        </div>
                    )}

                <section className="mt-8 space-y-5">
                    {filteredOrders.map((order) => (
                        <article
                            key={order.id}
                            className="rounded-2xl bg-white p-6 shadow-sm"
                        >
                            <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase text-gray-400">
                                        Orden
                                    </p>

                                    <p className="mt-1 break-all font-semibold text-[var(--charcoal-blue)]">
                                        {order.id}
                                    </p>

                                    <p className="mt-2 text-sm text-gray-500">
                                        Usuario: {order.userId}
                                    </p>
                                </div>

                                <div className="w-full sm:w-52">
                                    <label className="mb-1 block text-xs font-semibold text-gray-500">
                                        Estado
                                    </label>

                                    <select
                                        value={order.status}
                                        onChange={(event) =>
                                            handleStatusChange(
                                                order.id,
                                                event.target
                                                    .value as
                                                OrderStatus
                                            )
                                        }
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-semibold outline-none focus:border-[var(--pacific-cyan)]"
                                    >
                                        <option value="pending">
                                            Pendiente
                                        </option>

                                        <option value="processing">
                                            En proceso
                                        </option>

                                        <option value="completed">
                                            Completado
                                        </option>

                                        <option value="cancelled">
                                            Cancelado
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto]">
                                <div className="space-y-3">
                                    {order.items.map(
                                        (item) => (
                                            <div
                                                key={
                                                    item.productId
                                                }
                                                className="flex justify-between gap-4"
                                            >
                                                <div>
                                                    <p className="font-semibold text-gray-700">
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

                                <div className="border-t border-gray-100 pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                                    <p className="text-sm text-gray-500">
                                        Total
                                    </p>

                                    <p className="text-2xl font-black text-[var(--charcoal-blue)]">
                                        $
                                        {order.total.toLocaleString(
                                            "es-AR"
                                        )}
                                    </p>

                                    <p className="mt-2 text-xs text-gray-400">
                                        {order.createdAt
                                            ? order.createdAt.toLocaleString(
                                                "es-AR"
                                            )
                                            : "Sin fecha"}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </main>
    );
}