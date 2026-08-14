import { Link } from "react-router";

export function AdminPage() {
    return (
        <main>
            <h1>Panel de administración</h1>

            <p>
                Esta pantalla solo puede verla un administrador.
            </p>

            <Link to="/">
                Volver al inicio
            </Link>
        </main>
    );
}