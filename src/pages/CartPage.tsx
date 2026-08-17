import { Link } from "react-router";
import { useCart } from "../hooks/useCart";

export function CartPage() {
    const {
        items,
        removeItem,
        updateQuantity,
        clearCart,
    } = useCart();

    const total = items.reduce(
        (acc, item) =>
            acc + item.product.price * item.quantity,
        0
    );

    if (items.length === 0) {
        return (
            <main style={{ padding: "2rem" }}>
                <h1>Carrito</h1>

                <p>El carrito está vacío.</p>

                <Link to="/">
                    Volver al catálogo
                </Link>
            </main>
        );
    }

    return (
        <main style={{ padding: "2rem" }}>
            <h1>Carrito</h1>

            <Link to="/">
                ← Seguir comprando
            </Link>

            <ul>
                {items.map((item) => {
                    const subtotal =
                        item.product.price * item.quantity;

                    return (
                        <li key={item.product.id}>
                            <h3>{item.product.name}</h3>

                            <p>
                                Precio: ${item.product.price}
                            </p>

                            <p>
                                Cantidad: {item.quantity}
                            </p>

                            <button
                                onClick={() =>
                                    updateQuantity(
                                        item.product.id,
                                        item.quantity - 1
                                    )
                                }
                                disabled={item.quantity <= 1}
                            >
                                -
                            </button>

                            <button
                                onClick={() =>
                                    updateQuantity(
                                        item.product.id,
                                        item.quantity + 1
                                    )
                                }
                                disabled={
                                    item.quantity >= item.product.stock
                                }
                            >
                                +
                            </button>

                            <p>
                                Subtotal: ${subtotal}
                            </p>

                            <button
                                onClick={() =>
                                    removeItem(item.product.id)
                                }
                            >
                                Eliminar
                            </button>

                            <hr />
                        </li>
                    );
                })}
            </ul>

            <h2>Total: ${total}</h2>

            <button onClick={clearCart}>
                Vaciar carrito
            </button>

            <div>
                <Link to="/checkout">
                    Ir al checkout
                </Link>
            </div>
        </main>
    );
}