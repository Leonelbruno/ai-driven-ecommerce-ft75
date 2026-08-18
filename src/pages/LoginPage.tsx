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
            setError(
                "No se pudo iniciar sesión con Google"
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
                    Iniciar sesión
                </h1>

                <p className="mt-2 text-gray-500">
                    Accedé a tu cuenta de Patagonix Tech.
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
                        Iniciar sesión
                    </button>
                </form>

                <div className="my-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-sm text-gray-400">
                        o
                    </span>
                    <div className="h-px flex-1 bg-gray-200" />
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                    Continuar con Google
                </button>

                <p className="mt-6 text-center text-sm text-gray-500">
                    ¿No tenés cuenta?{" "}
                    <Link
                        to="/register"
                        className="font-bold text-[var(--pacific-cyan)]"
                    >
                        Registrate
                    </Link>
                </p>
            </section>
        </main>
    );
}