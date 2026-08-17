import { useEffect, useState, type FormEvent } from "react";

import { Link } from "react-router";

import type { Product } from "../types/Product";

import {
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct,
} from "../services/productService";

export function AdminPage() {
    const [products, setProducts] =
        useState<Product[]>([]);

    const [editingId, setEditingId] =
        useState<string | null>(null);

    const [name, setName] = useState("");
    const [description, setDescription] =
        useState("");

    const [price, setPrice] = useState("");
    const [categoryId, setCategoryId] =
        useState("");

    const [stock, setStock] = useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const loadProducts = async () => {
        try {
            setLoading(true);

            const data = await getProducts();

            setProducts(data);
        } catch {
            setError(
                "No se pudieron cargar los productos"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const resetForm = () => {
        setEditingId(null);
        setName("");
        setDescription("");
        setPrice("");
        setCategoryId("");
        setStock("");
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const productData = {
            name,
            description,
            price: Number(price),
            categoryId,
            stock: Number(stock),
        };

        try {
            setError("");

            if (editingId) {
                await updateProduct(
                    editingId,
                    productData
                );
            } else {
                await createProduct(productData);
            }

            resetForm();
            await loadProducts();
        } catch (error) {
            console.error(
                "Error al guardar producto:",
                error
            );

            setError(
                "No se pudo guardar el producto"
            );
        }
    };

    const handleEdit = (
        product: Product
    ) => {
        setEditingId(product.id);

        setName(product.name);
        setDescription(product.description);
        setPrice(String(product.price));
        setCategoryId(product.categoryId);
        setStock(String(product.stock));
    };

    const handleDelete = async (
        productId: string
    ) => {
        const confirmed = window.confirm(
            "¿Eliminar este producto?"
        );

        if (!confirmed) return;

        try {
            await deleteProduct(productId);
            await loadProducts();
        } catch (error) {
            console.error(
                "Error al eliminar producto:",
                error
            );

            setError(
                "No se pudo eliminar el producto"
            );
        }
    };

    return (
        <main style={{ padding: "2rem" }}>
            <h1>Panel de administración</h1>

            <Link to="/">
                ← Volver al catálogo
            </Link>
            <p>
                <Link to="/admin/orders">
                    Administrar órdenes
                </Link>
            </p>

            <h2>
                {editingId
                    ? "Editar producto"
                    : "Nuevo producto"}
            </h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Nombre
                        <input
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Descripción
                        <input
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Precio
                        <input
                            type="number"
                            min="0"
                            value={price}
                            onChange={(event) =>
                                setPrice(event.target.value)
                            }
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Categoría
                        <input
                            value={categoryId}
                            onChange={(event) =>
                                setCategoryId(
                                    event.target.value
                                )
                            }
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Stock
                        <input
                            type="number"
                            min="0"
                            value={stock}
                            onChange={(event) =>
                                setStock(event.target.value)
                            }
                            required
                        />
                    </label>
                </div>

                {error && <p>{error}</p>}

                <button type="submit">
                    {editingId
                        ? "Guardar cambios"
                        : "Crear producto"}
                </button>

                {editingId && (
                    <button
                        type="button"
                        onClick={resetForm}
                    >
                        Cancelar edición
                    </button>
                )}
            </form>

            <hr />

            <h2>Productos existentes</h2>

            {loading && (
                <p>Cargando productos...</p>
            )}

            {!loading && products.length === 0 && (
                <p>No hay productos.</p>
            )}

            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <strong>
                            {product.name}
                        </strong>

                        {" - $"}

                        {product.price}

                        {" - Stock: "}

                        {product.stock}

                        <button
                            onClick={() =>
                                handleEdit(product)
                            }
                        >
                            Editar
                        </button>

                        <button
                            onClick={() =>
                                handleDelete(product.id)
                            }
                        >
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
        </main>
    );
}