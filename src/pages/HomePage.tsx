import { useRef, useState, type JSX } from "react";
import { Link } from "react-router";

import { useAuth } from "../hooks/useAuth";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import { useDebounce } from "../hooks/useDebounce";

import { ProductCard } from "../components/ProductCard";

export function HomePage(): JSX.Element {
    const {
        user,
        isAuthenticated,
        loading: authLoading,
        logout,
    } = useAuth();

    const {
        products,
        loading,
        error,
    } = useProducts();

    const {
        items,
        addItem,
    } = useCart();

    const [search, setSearch] = useState("");
    const [category, setCategory] =
        useState("all");

    const [cartMessage, setCartMessage] = useState("");

    const messageTimeout =
        useRef<number | null>(null);

    const debouncedSearch =
        useDebounce(search, 300);

    const categories = [
        ...new Set(
            products
                .map(
                    (product) =>
                        product.categoryId
                )
                .filter(
                    (categoryId) =>
                        typeof categoryId ===
                        "string" &&
                        categoryId.trim() !== ""
                )
        ),
    ];

    const filteredProducts =
        products.filter((product) => {
            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(
                        debouncedSearch.toLowerCase()
                    );

            const matchesCategory =
                category === "all" ||
                product.categoryId === category;

            return (
                matchesSearch &&
                matchesCategory
            );
        });

    const cartCount = items.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

    const handleAddToCart = (product: typeof products[number]) => {
        addItem(product);

        setCartMessage(
            `${product.name} agregado al carrito`
        );

        if (messageTimeout.current) {
            window.clearTimeout(
                messageTimeout.current
            );
        }

        messageTimeout.current =
            window.setTimeout(() => {
                setCartMessage("");
            }, 2000);
    };

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* HEADER */}

            <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <Link
                        to="/"
                        className="text-xl font-black tracking-tight text-[var(--charcoal-blue)] sm:text-2xl"
                    >
                        PATAGONIX
                        <span className="text-[var(--muted-teal)]">
                            {" "}
                            TECH
                        </span>
                    </Link>

                    <nav className="flex flex-wrap items-center gap-3 text-sm font-medium">
                        <Link
                            to="/cart"
                            className="rounded-lg bg-[var(--tea-green)] px-4 py-2 text-[var(--charcoal-blue)] hover:brightness-95"
                        >
                            Carrito ({cartCount})
                        </Link>

                        {!authLoading &&
                            !isAuthenticated && (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-[var(--charcoal-blue)] hover:text-[var(--pacific-cyan)]"
                                    >
                                        Iniciar sesión
                                    </Link>

                                    <Link
                                        to="/register"
                                        className="rounded-lg bg-[var(--charcoal-blue)] px-4 py-2 text-white hover:bg-[var(--dark-slate-grey)]"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}

                        {!authLoading &&
                            isAuthenticated && (
                                <>
                                    <Link
                                        to="/profile"
                                        className="text-[var(--charcoal-blue)] hover:text-[var(--pacific-cyan)]"
                                    >
                                        Mi cuenta
                                    </Link>

                                    <Link
                                        to="/orders"
                                        className="text-[var(--charcoal-blue)] hover:text-[var(--pacific-cyan)]"
                                    >
                                        Mis pedidos
                                    </Link>

                                    {user?.role ===
                                        "admin" && (
                                            <Link
                                                to="/admin"
                                                className="rounded-lg border border-[var(--pacific-cyan)] px-3 py-2 text-[var(--pacific-cyan)] hover:bg-gray-50"
                                            >
                                                Admin
                                            </Link>
                                        )}

                                    <button
                                        onClick={logout}
                                        className="text-gray-500 hover:text-red-600"
                                    >
                                        Salir
                                    </button>
                                </>
                            )}
                    </nav>
                </div>
            </header>

            {/* HERO */}

            <section className="bg-[var(--charcoal-blue)] text-white">
                <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                    <p className="mb-2 font-semibold text-[var(--tea-green)]">
                        Tecnología para todos los días
                    </p>

                    <h1 className="max-w-2xl text-3xl font-black sm:text-4xl lg:text-5xl">
                        Encontrá tu próximo producto favorito
                    </h1>

                    <p className="mt-4 max-w-xl text-gray-200">
                        Explorá nuestro catálogo,
                        compará productos y comprá
                        de forma simple.
                    </p>
                </div>
            </section>

            {/* CATÁLOGO */}

            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[var(--charcoal-blue)]">
                        Catálogo
                    </h2>

                    <p className="mt-1 text-gray-500">
                        Buscá por nombre o filtrá
                        por categoría.
                    </p>
                </div>

                {/* FILTROS */}

                <div className="mb-8 grid gap-4 rounded-2xl bg-white p-5 shadow-sm sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="search"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            Buscar producto
                        </label>

                        <input
                            id="search"
                            type="search"
                            placeholder="Ej: auriculares..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[var(--pacific-cyan)] focus:ring-2 focus:ring-[var(--tea-green)]"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="category"
                            className="mb-2 block text-sm font-semibold text-gray-700"
                        >
                            Categoría
                        </label>

                        <select
                            id="category"
                            value={category}
                            onChange={(event) =>
                                setCategory(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[var(--pacific-cyan)]"
                        >
                            <option value="all">
                                Todas
                            </option>

                            {categories.map(
                                (categoryName) => (
                                    <option
                                        key={categoryName}
                                        value={categoryName}
                                    >
                                        {categoryName}
                                    </option>
                                )
                            )}
                        </select>
                    </div>
                </div>

                {/* ESTADOS */}

                {loading && (
                    <div className="rounded-xl bg-white p-8 text-center text-gray-500">
                        Cargando productos...
                    </div>
                )}

                {error && (
                    <div className="rounded-xl bg-red-50 p-5 text-red-700">
                        {error}
                    </div>
                )}

                {!loading &&
                    !error &&
                    filteredProducts.length ===
                    0 && (
                        <div className="rounded-xl bg-white p-10 text-center">
                            <h3 className="font-bold text-[var(--charcoal-blue)]">
                                No encontramos productos
                            </h3>

                            <p className="mt-2 text-gray-500">
                                Probá otra búsqueda o
                                categoría.
                            </p>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    filteredProducts.length >
                    0 && (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredProducts.map(
                                (product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={handleAddToCart}
                                    />
                                )
                            )}
                        </div>
                    )}
            </main>

            {cartMessage && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[var(--charcoal-blue)] px-5 py-3 font-semibold text-white shadow-xl"
                >
                    ✓ {cartMessage}
                </div>
            )}

            {/* FOOTER */}

            <footer className="mt-12 bg-[var(--charcoal-blue)] px-4 py-8 text-center text-sm text-gray-300">
                Patagonix Tech · AI Driven
                E-Commerce
            </footer>
        </div>
    );
}