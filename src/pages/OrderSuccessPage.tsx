import {
    Link,
    useParams,
} from "react-router";

export function OrderSuccessPage() {
    const { orderId } = useParams();

    return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-10">
            <section className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-lg">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--tea-green)] text-3xl text-[var(--charcoal-blue)]">
                    ✓
                </div>

                <h1 className="mt-6 text-3xl font-black text-[var(--charcoal-blue)]">
                    Compra realizada
                </h1>

                <p className="mt-3 text-gray-500">
                    Tu pedido fue registrado correctamente.
                </p>

                <div className="mt-6 rounded-xl bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                        Código de orden
                    </p>

                    <p className="mt-1 break-all font-semibold text-[var(--charcoal-blue)]">
                        {orderId}
                    </p>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                    <Link
                        to="/orders"
                        className="flex-1 rounded-lg bg-[var(--charcoal-blue)] px-4 py-3 font-bold text-white"
                    >
                        Ver mis pedidos
                    </Link>

                    <Link
                        to="/"
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-bold text-gray-700"
                    >
                        Seguir comprando
                    </Link>
                </div>
            </section>
        </main>
    );
}