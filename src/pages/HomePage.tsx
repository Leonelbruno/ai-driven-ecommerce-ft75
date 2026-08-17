import { useState, type JSX } from "react";
import { Link } from "react-router";

import { useAuth } from "../hooks/useAuth";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";
import { useDebounce } from "../hooks/useDebounce";

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
        removeItem,
        clearCart,
    } = useCart();

    // Búsqueda y categoría seleccionada
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");

    // Espera 300ms después de que el usuario deja de escribir
    const debouncedSearch = useDebounce(search, 300);

    // Obtiene las categorías existentes de los productos
    const categories = [
        ...new Set(
            products.map((product) => product.categoryId)
        ),
    ];

    // Filtra productos por nombre y categoría
    const filteredProducts = products.filter(
        (product) => {
            const matchesSearch = product.name
                .toLowerCase()
                .includes(debouncedSearch.toLowerCase());

            const matchesCategory =
                category === "all" ||
                product.categoryId === category;

            return matchesSearch && matchesCategory;
        }
    );

    const cartCount = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <div style={{ padding: "2rem" }}>
            <h1>HENRY-Commerce</h1>

            {/* AUTENTICACIÓN */}

            {authLoading ? (
                <p>Comprobando sesión...</p>
            ) : (
                <>
                    <p>
                        Estado:
                        {isAuthenticated
                            ? " Autenticado"
                            : " No autenticado"}
                    </p>

                    {user && (
                        <p>
                            Usuario: {user.email} - {user.role}
                        </p>
                    )}

                    {!isAuthenticated && (
                        <div>
                            <Link to="/login">
                                Iniciar sesión
                            </Link>

                            {" | "}

                            <Link to="/register">
                                Registrarse
                            </Link>
                        </div>
                    )}

                    {isAuthenticated && (
                        <button onClick={logout}>
                            Logout
                        </button>
                    )}
                </>
            )}

            <hr />

            {/* CATÁLOGO */}

            <h2>Productos</h2>

            <div>
                <label htmlFor="search">
                    Buscar producto
                </label>

                <input
                    id="search"
                    type="search"
                    placeholder="Buscar..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                />
            </div>

            <div>
                <label htmlFor="category">
                    Categoría
                </label>

                <select
                    id="category"
                    value={category}
                    onChange={(event) =>
                        setCategory(event.target.value)
                    }
                >
                    <option value="all">
                        Todas
                    </option>

                    {categories.map((categoryName) => (
                        <option
                            key={categoryName}
                            value={categoryName}
                        >
                            {categoryName}
                        </option>
                    ))}
                </select>
            </div>

            {/* ESTADOS DEL CATÁLOGO */}

            {loading && (
                <p>Cargando productos...</p>
            )}

            {error && (
                <p>{error}</p>
            )}

            {!loading &&
                !error &&
                filteredProducts.length === 0 && (
                    <p>
                        No se encontraron productos.
                    </p>
                )}

            {!loading &&
                !error &&
                filteredProducts.length > 0 && (
                    <ul>
                        {filteredProducts.map((product) => (
                            <li key={product.id}>
                                {product.name} - ${product.price}

                                {" "}

                                <Link to={`/product/${product.id}`}>
                                    Ver detalle
                                </Link>

                                {" "}

                                <button
                                    onClick={() => addItem(product)}
                                >
                                    Agregar al carrito
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

            {/* CARRITO */}

            <h2>Carrito</h2>

            <Link to="/cart">
                Ver carrito ({cartCount})
            </Link>
            {items.length === 0 ? (
                <p>El carrito está vacío</p>
            ) : (
                <ul>
                    {items.map((item) => (
                        <li key={item.product.id}>
                            {item.product.name} x{" "}
                            {item.quantity}

                            <button
                                onClick={() =>
                                    removeItem(item.product.id)
                                }
                            >
                                Eliminar
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {items.length > 0 && (
                <button onClick={clearCart}>
                    Vaciar carrito
                </button>
            )}

            {/* NAVEGACIÓN DEL USUARIO */}

            {isAuthenticated && (
                <div>
                    <Link to="/profile">
                        Mi cuenta
                    </Link>

                    {user?.role === "admin" && (
                        <>
                            {" | "}

                            <Link to="/admin">
                                Panel admin
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}