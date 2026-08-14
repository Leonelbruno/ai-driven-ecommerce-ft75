import type { JSX } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";

export function HomePage(): JSX.Element {
    const {
        user,
        isAuthenticated,
        loading: authLoading,
        logout,
    } = useAuth();

    const { products, loading, error } = useProducts();
    const { items, addItem, removeItem, clearCart } = useCart();

    return (
        <div style={{ padding: "2rem" }}>
            <h1>HENRY-Commerce</h1>

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
                            <Link to="/login">Iniciar sesión</Link>
                            {" | "}
                            <Link to="/register">Registrarse</Link>
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

            <h2>Productos</h2>

            {loading && <p>Cargando productos...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && (
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            {product.name} - ${product.price}

                            <button onClick={() => addItem(product)}>
                                Agregar al carrito
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <h2>Carrito</h2>

            {items.length === 0 ? (
                <p>El carrito está vacío</p>
            ) : (
                <ul>
                    {items.map((item) => (
                        <li key={item.product.id}>
                            {item.product.name} x {item.quantity}

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