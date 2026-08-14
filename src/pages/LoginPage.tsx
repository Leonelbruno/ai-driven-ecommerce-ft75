import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
    const { login, loginGoogle } = useAuth();

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

            await login(email, password);

            navigate("/");
        } catch {
            setError("Email o contraseña incorrectos");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setError("");

            await loginGoogle();

            navigate("/");
        } catch {
            setError("No se pudo iniciar sesión con Google");
        }
    };

    return (
        <main>
            <h1>Iniciar sesión</h1>

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
                    Iniciar sesión
                </button>
            </form>

            <button onClick={handleGoogleLogin}>
                Continuar con Google
            </button>

            <p>
                ¿No tenés cuenta?{" "}
                <Link to="/register">
                    Registrate
                </Link>
            </p>

            <Link to="/">
                Volver al inicio
            </Link>
        </main>
    );
}