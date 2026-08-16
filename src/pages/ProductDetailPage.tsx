import { Link, useParams } from "react-router";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../hooks/useCart";

export function ProductDetailPage() {
    const { productId } = useParams();

    const {
        products,
        loading,
        error,
    } = useProducts();

    const { addItem } = useCart();

    if (loading) {
        return <p>Cargando producto...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const product = products.find(
        (product) => product.id === productId
    );

    if (!product) {
        return (
            <main>
                <h1>Producto no encontrado</h1>
                <Link to="/">Volver al catálogo</Link>
            </main>
        );
    }

    return (
        <main style={{ padding: "2rem" }}>
            <Link to="/">
                ← Volver al catálogo
            </Link>

            <h1>{product.name}</h1>

            <p>{product.description}</p>

            <p>
                Precio: ${product.price}
            </p>

            <p>
                Categoría: {product.categoryId}
            </p>

            <p>
                Stock: {product.stock}
            </p>

            {product.imageUrl && (
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    width="300"
                />
            )}

            <div>
                <button
                    onClick={() => addItem(product)}
                    disabled={product.stock <= 0}
                >
                    {product.stock > 0
                        ? "Agregar al carrito"
                        : "Sin stock"}
                </button>
            </div>
        </main>
    );
}