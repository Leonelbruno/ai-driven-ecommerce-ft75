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
        const loadOrders = async () => {
            if (!user) return;

            try {
                setLoading(true);
                setError("");

                const data = await getUserOrders(
                    user.uid
                );

                setOrders(data);
            } catch (error) {
                console.error(
                    "Error al cargar órdenes:",
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

    if (loading) {
        return <p>Cargando pedidos...</p>;
    }

    return (
        <main style={{ padding: "2rem" }}>
            <h1>Mis pedidos</h1>

            <Link to="/">
                ← Volver al catálogo
            </Link>

            {error && <p>{error}</p>}

            {!error && orders.length === 0 && (
                <p>Todavía no realizaste compras.</p>
            )}

            {orders.map((order) => (
                <article key={order.id}>
                    <hr />

                    <h2>
                        Pedido {order.id}
                    </h2>

                    <p>
                        Estado: {order.status}
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

                    <strong>
                        Total: ${order.total}
                    </strong>
                </article>
            ))}
        </main>
    );
}