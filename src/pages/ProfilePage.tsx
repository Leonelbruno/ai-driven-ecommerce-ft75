import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

export function ProfilePage() {
    const { user } = useAuth();

    return (
        <main className="min-h-screen bg-[var(--background)] px-4 py-10">
            <div className="mx-auto max-w-2xl">
                <Link
                    to="/"
                    className="font-semibold text-[var(--pacific-cyan)]"
                >
                    ← Volver al catálogo
                </Link>

                <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--tea-green)] text-2xl font-black text-[var(--charcoal-blue)]">
                        {user?.email
                            ?.charAt(0)
                            .toUpperCase()}
                    </div>

                    <h1 className="mt-5 text-3xl font-black text-[var(--charcoal-blue)]">
                        Mi cuenta
                    </h1>

                    <div className="mt-7 space-y-5">
                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">
                                Email
                            </p>

                            <p className="mt-1 font-semibold text-[var(--charcoal-blue)]">
                                {user?.email}
                            </p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-4">
                            <p className="text-sm text-gray-500">
                                Rol
                            </p>

                            <span className="mt-2 inline-block rounded-full bg-[var(--tea-green)] px-3 py-1 text-sm font-bold text-[var(--charcoal-blue)]">
                                {user?.role === "admin"
                                    ? "Administrador"
                                    : "Cliente"}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            to="/orders"
                            className="rounded-lg bg-[var(--charcoal-blue)] px-5 py-3 font-bold text-white"
                        >
                            Mis pedidos
                        </Link>

                        {user?.role === "admin" && (
                            <Link
                                to="/admin"
                                className="rounded-lg border border-[var(--pacific-cyan)] px-5 py-3 font-bold text-[var(--pacific-cyan)]"
                            >
                                Panel administrador
                            </Link>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}