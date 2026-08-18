import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import type { Product } from "../types/Product";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../services/productService";
import { uploadProductImage } from "../services/imageService";

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

    const [imageFile, setImageFile] =
        useState<File | null>(null);

    const [
        currentImageUrl,
        setCurrentImageUrl,
    ] =
        useState<string | undefined>(
            undefined
        );

    const [saving, setSaving] = useState(false);

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
        setImageFile(null);
        setCurrentImageUrl(undefined);
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            let imageUrl = currentImageUrl;

            if (imageFile) {
                imageUrl = await uploadProductImage(imageFile);
            }

            const productData = {
                name,
                description,
                price: Number(price),
                categoryId,
                stock: Number(stock),
                ...(imageUrl ? { imageUrl } : {}),
            };

            if (editingId) {
                await updateProduct(editingId, productData);
            } else {
                await createProduct(productData);
            }

            resetForm();
            await loadProducts();
        } catch (error) {
            console.error(error);
            setError("No se pudo guardar el producto");
        } finally {
            setSaving(false);
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
        setCurrentImageUrl(
            product.imageUrl
        );
        setImageFile(null);
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
        <main className="min-h-screen bg-slate-100">
            {/* HEADER ADMIN */}

            <header className="bg-[var(--charcoal-blue)] text-white shadow-md">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
                    <div>
                        <p className="text-sm font-semibold text-[var(--tea-green)]">
                            PATAGONIX TECH
                        </p>

                        <h1 className="text-2xl font-black">
                            Panel de administración
                        </h1>
                    </div>

                    <nav className="flex flex-wrap gap-3">
                        <Link
                            to="/admin/orders"
                            className="rounded-lg bg-white/10 px-4 py-2 font-semibold hover:bg-white/20"
                        >
                            Gestionar pedidos
                        </Link>

                        <Link
                            to="/"
                            className="rounded-lg bg-[var(--tea-green)] px-4 py-2 font-bold text-[var(--charcoal-blue)]"
                        >
                            Ver tienda
                        </Link>
                    </nav>
                </div>
            </header>

            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[380px_1fr] lg:px-8">

                {/* FORMULARIO */}

                <section className="h-fit rounded-2xl bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-black text-[var(--charcoal-blue)]">
                        {editingId
                            ? "Editar producto"
                            : "Nuevo producto"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        {editingId
                            ? "Modificá los datos del producto seleccionado."
                            : "Agregá un producto al catálogo."}
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-6 space-y-4"
                    >
                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                Nombre
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[var(--pacific-cyan)] focus:ring-2 focus:ring-[var(--tea-green)]"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                Descripción
                            </label>

                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                required
                                rows={3}
                                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[var(--pacific-cyan)]"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Precio
                                </label>

                                <input
                                    type="number"
                                    value={price}
                                    onChange={(event) =>
                                        setPrice(
                                            event.target.value
                                        )
                                    }
                                    required
                                    min="0"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[var(--pacific-cyan)]"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Stock
                                </label>

                                <input
                                    type="number"
                                    value={stock}
                                    onChange={(event) =>
                                        setStock(
                                            event.target.value
                                        )
                                    }
                                    required
                                    min="0"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[var(--pacific-cyan)]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                Categoría
                            </label>

                            <input
                                type="text"
                                value={categoryId}
                                onChange={(event) =>
                                    setCategoryId(
                                        event.target.value
                                    )
                                }
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[var(--pacific-cyan)]"
                            />
                        </div>

                        {/* IMAGEN */}

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                Imagen
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(event) =>
                                    setImageFile(
                                        event.target.files?.[0] ??
                                        null
                                    )
                                }
                                className="block w-full rounded-lg border border-gray-300 p-2 text-sm"
                            />

                            {imageFile && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Archivo: {imageFile.name}
                                </p>
                            )}

                            {!imageFile &&
                                currentImageUrl && (
                                    <img
                                        src={currentImageUrl}
                                        alt="Imagen actual"
                                        className="mt-3 h-32 w-full rounded-xl object-cover"
                                    />
                                )}
                        </div>

                        {error && (
                            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--charcoal-blue)] px-4 py-3 font-bold text-white hover:bg-[var(--dark-slate-grey)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving && (
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            )}

                            {saving
                                ? editingId
                                    ? "Actualizando producto..."
                                    : "Agregando producto..."
                                : editingId
                                    ? "Guardar cambios"
                                    : "Crear producto"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-600"
                            >
                                Cancelar edición
                            </button>
                        )}
                    </form>
                </section>

                {/* PRODUCTOS */}

                <section>
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-[var(--charcoal-blue)]">
                            Productos
                        </h2>

                        <p className="mt-1 text-gray-500">
                            Administrá el catálogo de la tienda.
                        </p>
                    </div>

                    {loading && (
                        <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
                            Cargando productos...
                        </div>
                    )}

                    {!loading &&
                        products.length === 0 && (
                            <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
                                No hay productos cargados.
                            </div>
                        )}

                    <div className="grid gap-5 md:grid-cols-2">
                        {products.map((product) => (
                            <article
                                key={product.id}
                                className="overflow-hidden rounded-2xl bg-white shadow-sm"
                            >
                                <div className="h-44 bg-gray-100">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="h-full w-full object-contain p-3"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-400">
                                            Sin imagen
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <span className="text-xs font-bold uppercase text-[var(--pacific-cyan)]">
                                                {product.categoryId}
                                            </span>

                                            <h3 className="mt-1 text-lg font-black text-[var(--charcoal-blue)]">
                                                {product.name}
                                            </h3>
                                        </div>

                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                            Stock {product.stock}
                                        </span>
                                    </div>

                                    <p className="mt-3 line-clamp-2 text-sm text-gray-500">
                                        {product.description}
                                    </p>

                                    <p className="mt-4 text-2xl font-black text-[var(--charcoal-blue)]">
                                        $
                                        {product.price.toLocaleString(
                                            "es-AR"
                                        )}
                                    </p>

                                    <div className="mt-5 flex gap-3">
                                        <button
                                            onClick={() =>
                                                handleEdit(product)
                                            }
                                            className="flex-1 rounded-lg border border-[var(--pacific-cyan)] px-4 py-2 font-bold text-[var(--pacific-cyan)] hover:bg-gray-50"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    product.id
                                                )
                                            }
                                            className="flex-1 rounded-lg border border-red-200 px-4 py-2 font-bold text-red-600 hover:bg-red-50"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
}