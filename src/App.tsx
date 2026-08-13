import type { JSX } from "react";
import { useAuth } from "./hooks/useAuth";
import type { User } from "./types/User";
import { useProducts } from "./hooks/useProducts";
import { useCart } from "./hooks/useCart";

function App(): JSX.Element {
  const { user, isAuthenticated, login, logout } = useAuth();
  const { products, loading, error } = useProducts();
  const { items, addItem, removeItem, clearCart } = useCart();

  const mockUser: User = {
    uid: "user-1",
    email: "leo@email.com",
    displayName: "Leo",
    role: "customer",
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>HENRY-Commerce</h1>

      <p>
        Estado:
        {isAuthenticated
          ? " Autenticado"
          : " No autenticado"}
      </p>

      {user && (
        <p>
          Usuario: {user.displayName} - {user.role}
        </p>
      )}

      {!isAuthenticated ? (
        <button onClick={() => login(mockUser)}>
          Login simulado
        </button>
      ) : (
        <button onClick={logout}>
          Logout
        </button>
      )}
      <hr />

      <h2>Productos</h2>

      {loading && <p>Cargando productos...</p>}

      {error && <p>{error}</p>}

      {
        !loading && !error && (
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
        )
      }
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
    </div>
  )
}

export default App;