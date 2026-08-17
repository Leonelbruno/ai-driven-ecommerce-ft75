import { useState } from "react";
import { Link, useNavigate } from "react-router";

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
            item.product.price * item.quantity,
        0
    );

    const handleCheckout = async () => {
        if (!user || items.length === 0) {
            return;
        }

        try {
            setProcessing(true);
            setError("");

            const orderId = await createOrder(
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
            <main>
                <h1>Checkout</h1>

                <p>
                    No hay productos en el carrito.
                </p>

                <Link to="/">
                    Volver al catálogo
                </Link>
            </main>
        );
    }

    return (
        <main style={{ padding: "2rem" }}>
            <h1>Checkout</h1>

            <p>
                Usuario: {user?.email}
            </p>

            <h2>Resumen</h2>

            <ul>
                {items.map((item) => (
                    <li key={item.product.id}>
                        {item.product.name}
                        {" x "}
                        {item.quantity}
                        {" - $"}
                        {item.product.price *
                            item.quantity}
                    </li>
                ))}
            </ul>

            <h2>Total: ${total}</h2>

            {error && (
                <p>{error}</p>
            )}

            <button
                onClick={handleCheckout}
                disabled={processing}
            >
                {processing
                    ? "Procesando..."
                    : "Confirmar compra"}
            </button>

            <div>
                <Link to="/cart">
                    Volver al carrito
                </Link>
            </div>
        </main>
    );
}