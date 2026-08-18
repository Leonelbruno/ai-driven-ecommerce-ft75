import { Link } from "react-router";
import type { Product } from "../types/Product";

type ProductCardProps = {
    product: Product;
    onAddToCart: (product: Product) => void;
};

export function ProductCard({
    product,
    onAddToCart,
}: ProductCardProps) {
    return (
        <article className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex h-52 items-center justify-center bg-white">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-contain p-4"
                    />
                ) : (
                    <span className="text-sm text-gray-400">
                        Sin imagen
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <span className="mb-2 text-sm font-medium text-[var(--pacific-cyan)]">
                    {product.categoryId}
                </span>

                <h3 className="text-lg font-bold text-[var(--charcoal-blue)]">
                    {product.name}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                    {product.description}
                </p>

                <div className="mt-auto pt-5">
                    <p className="text-2xl font-bold text-[var(--charcoal-blue)]">
                        ${product.price.toLocaleString("es-AR")}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Stock: {product.stock}
                    </p>

                    <div className="mt-4 flex gap-2">
                        <Link
                            to={`/product/${product.id}`}
                            className="flex-1 rounded-lg border border-[var(--pacific-cyan)] px-3 py-2 text-center text-sm font-semibold text-[var(--pacific-cyan)] hover:bg-gray-50"
                        >
                            Ver detalle
                        </Link>

                        <button
                            onClick={() => onAddToCart(product)}
                            disabled={product.stock <= 0}
                            className="flex-1 rounded-lg bg-[var(--charcoal-blue)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--dark-slate-grey)] disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            {product.stock > 0
                                ? "Agregar"
                                : "Sin stock"}
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}