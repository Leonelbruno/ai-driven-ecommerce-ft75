import { Link, useParams } from "react-router";

export function OrderSuccessPage() {
    const { orderId } = useParams();

    return (
        <main style={{ padding: "2rem" }}>
            <h1>Compra realizada</h1>

            <p>
                Tu pedido fue registrado correctamente.
            </p>

            <p>
                Orden: {orderId}
            </p>
            <p>
                <Link to="/orders">
                    Ver mis pedidos
                </Link>
            </p>
            <Link to="/">
                Volver al catálogo
            </Link>
        </main>
    );
}