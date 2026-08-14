import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

export function ProfilePage() {
    const { user } = useAuth();

    return (
        <main>
            <h1>Mi cuenta</h1>

            <p>Email: {user?.email}</p>
            <p>Rol: {user?.role}</p>

            <Link to="/">
                Volver al inicio
            </Link>
        </main>
    );
}