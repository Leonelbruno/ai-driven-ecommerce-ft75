import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

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
        } catch (error) {
            console.error(
                "Error al registrar:",
                error
            );

            setError(
                "No se pudo registrar el usuario"
            );
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-10">
            <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <Link
                    to="/"
                    className="mb-8 inline-block font-semibold text-[var(--pacific-cyan)] hover:underline"
                >
                    ← Volver al catálogo
                </Link>

                <h1 className="text-3xl font-black text-[var(--charcoal-blue)]">
                    Crear cuenta
                </h1>

                <p className="mt-2 text-gray-500">
                    Registrate para comprar y seguir tus pedidos.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5"
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
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
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[var(--pacific-cyan)] focus:ring-2 focus:ring-[var(--tea-green)]"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
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
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[var(--pacific-cyan)] focus:ring-2 focus:ring-[var(--tea-green)]"
                        />
                    </div>

                    {error && (
                        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-[var(--charcoal-blue)] px-4 py-3 font-bold text-white hover:bg-[var(--dark-slate-grey)]"
                    >
                        Crear cuenta
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    ¿Ya tenés cuenta?{" "}
                    <Link
                        to="/login"
                        className="font-bold text-[var(--pacific-cyan)]"
                    >
                        Iniciar sesión
                    </Link>
                </p>
            </section>
        </main>
    );
}