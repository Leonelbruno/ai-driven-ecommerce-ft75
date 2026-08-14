import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router";

export function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        try {
            setError("");

            await register(email, password);
            navigate("/");

        } catch {
            setError("No se pudo registrar el usuario");
        }
    };

    return (
        <main>
            <h1>Crear cuenta</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">
                        Contraseña
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />
                </div>

                {error && <p>{error}</p>}

                <button type="submit">
                    Registrarme
                </button>
            </form>
            <p>
                ¿Ya tenés cuenta?{" "}
                <Link to="/login">
                    Iniciar sesión
                </Link>
            </p>

            <Link to="/">
                Volver al inicio
            </Link>
        </main>
    );
}