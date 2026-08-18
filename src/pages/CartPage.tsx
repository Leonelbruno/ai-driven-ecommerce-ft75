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
            acc +
            item.product.price *
            item.quantity,
        0
    );

    if (items.length === 0) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
                <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                    <h1 className="text-3xl font-black text-[var(--charcoal-blue)]">
                        Tu carrito está vacío
                    </h1>

                    <p className="mt-3 text-gray-500">
                        Agregá productos desde nuestro catálogo.
                    </p>

                    <Link
                        to="/"
                        className="mt-6 inline-block rounded-lg bg-[var(--charcoal-blue)] px-5 py-3 font-bold text-white"
                    >
                        Ver productos
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--background)] px-4 py-10">
            <div className="mx-auto max-w-5xl">
                <Link
                    to="/"
                    className="font-semibold text-[var(--pacific-cyan)]"
                >
                    ← Seguir comprando
                </Link>

                <h1 className="mt-6 text-3xl font-black text-[var(--charcoal-blue)]">
                    Tu carrito
                </h1>

                <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
                    <section className="space-y-4">
                        {items.map((item) => {
                            const subtotal =
                                item.product.price *
                                item.quantity;

                            return (
                                <article
                                    key={item.product.id}
                                    className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row"
                                >
                                    {item.product.imageUrl && (
                                        <img
                                            src={
                                                item.product.imageUrl
                                            }
                                            alt={
                                                item.product.name
                                            }
                                            className="h-32 w-full rounded-xl object-cover sm:w-32"
                                        />
                                    )}

                                    <div className="flex-1">
                                        <h2 className="text-lg font-bold text-[var(--charcoal-blue)]">
                                            {item.product.name}
                                        </h2>

                                        <p className="mt-1 text-gray-500">
                                            $
                                            {item.product.price.toLocaleString(
                                                "es-AR"
                                            )}
                                        </p>

                                        <div className="mt-4 flex items-center gap-3">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.product.id,
                                                        item.quantity -
                                                        1
                                                    )
                                                }
                                                disabled={
                                                    item.quantity <= 1
                                                }
                                                className="h-9 w-9 rounded-lg border border-gray-300 font-bold disabled:opacity-40"
                                            >
                                                -
                                            </button>

                                            <div>
                                                <span className="min-w-8 text-center font-bold">
                                                    {item.quantity}
                                                </span>

                                                <span className="sr-only">
                                                    Cantidad: {item.quantity}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.product.id,
                                                        item.quantity +
                                                        1
                                                    )
                                                }
                                                disabled={
                                                    item.quantity >=
                                                    item.product.stock
                                                }
                                                className="h-9 w-9 rounded-lg border border-gray-300 font-bold disabled:opacity-40"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <button
                                            onClick={() =>
                                                removeItem(
                                                    item.product.id
                                                )
                                            }
                                            className="mt-4 text-sm font-semibold text-red-600"
                                        >
                                            Eliminar
                                        </button>
                                    </div>

                                    <strong className="text-lg text-[var(--charcoal-blue)]">
                                        $
                                        {subtotal.toLocaleString(
                                            "es-AR"
                                        )}
                                    </strong>
                                </article>
                            );
                        })}
                    </section>

                    <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-[var(--charcoal-blue)]">
                            Resumen
                        </h2>

                        <div className="my-5 border-t border-gray-200" />

                        <div className="flex justify-between text-lg">
                            <span>Total</span>

                            <strong>
                                $
                                {total.toLocaleString(
                                    "es-AR"
                                )}
                            </strong>
                        </div>

                        <Link
                            to="/checkout"
                            className="mt-6 block rounded-lg bg-[var(--charcoal-blue)] px-4 py-3 text-center font-bold text-white hover:bg-[var(--dark-slate-grey)]"
                        >
                            Ir al checkout
                        </Link>

                        <button
                            onClick={clearCart}
                            className="mt-3 w-full rounded-lg border border-red-200 px-4 py-3 text-sm font-semibold text-red-600"
                        >
                            Vaciar carrito
                        </button>
                    </aside>
                </div>
            </div>
        </main>
    );
}