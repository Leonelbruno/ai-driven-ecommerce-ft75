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
            await updateOrderStatus(
                orderId,
                status
            );

            await loadOrders();
        } catch (error) {
            console.error(
                "Error al actualizar estado:",
                error
            );

            setError(
                "No se pudo actualizar la orden"
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
        <main style={{ padding: "2rem" }}>
            <h1>Administrar órdenes</h1>

            <Link to="/admin">
                ← Volver al panel
            </Link>

            <div>
                <label htmlFor="status-filter">
                    Filtrar por estado
                </label>

                <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(
                            event.target.value
                        )
                    }
                >
                    <option value="all">
                        Todas
                    </option>

                    <option value="pending">
                        Pendientes
                    </option>

                    <option value="processing">
                        En proceso
                    </option>

                    <option value="completed">
                        Completadas
                    </option>

                    <option value="cancelled">
                        Canceladas
                    </option>
                </select>
            </div>

            {error && <p>{error}</p>}

            {!error &&
                filteredOrders.length === 0 && (
                    <p>No hay órdenes.</p>
                )}

            {filteredOrders.map((order) => (
                <article key={order.id}>
                    <hr />

                    <h2>
                        Orden {order.id}
                    </h2>

                    <p>
                        Usuario: {order.userId}
                    </p>

                    <p>
                        Fecha:{" "}
                        {order.createdAt.toLocaleString()}
                    </p>

                    <ul>
                        {order.items.map((item) => (
                            <li key={item.productId}>
                                {item.name}
                                {" x "}
                                {item.quantity}
                                {" - $"}
                                {item.priceAtPurchase}
                            </li>
                        ))}
                    </ul>

                    <p>
                        Total: ${order.total}
                    </p>

                    <label>
                        Estado
                        <select
                            value={order.status}
                            onChange={(event) =>
                                handleStatusChange(
                                    order.id,
                                    event.target
                                        .value as OrderStatus
                                )
                            }
                        >
                            <option value="pending">
                                Pendiente
                            </option>

                            <option value="processing">
                                En proceso
                            </option>

                            <option value="completed">
                                Completada
                            </option>

                            <option value="cancelled">
                                Cancelada
                            </option>
                        </select>
                    </label>
                </article>
            ))}
        </main>
    );
}