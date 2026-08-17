import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import type { Product } from "../types/Product";

export async function getProducts(): Promise<Product[]> {
    const snapshot = await getDocs(
        collection(db, "products")
    );

    return snapshot.docs.map((document) => {
        const data = document.data();

        return {
            id: document.id,
            name: data.name,
            description: data.description,
            price: data.price,
            categoryId: data.categoryId,
            imageUrl: data.imageUrl,
            stock: data.stock,
        };
    });
}

type ProductInput = Omit<
    Product,
    "id" | "createdAt" | "updatedAt"
>;

export async function createProduct(
    product: ProductInput
) {
    const document = await addDoc(
        collection(db, "products"),
        {
            ...product,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        }
    );

    return document.id;
}

export async function updateProduct(
    productId: string,
    product: Partial<ProductInput>
) {
    const productRef = doc(
        db,
        "products",
        productId
    );

    await updateDoc(productRef, {
        ...product,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteProduct(
    productId: string
) {
    await deleteDoc(
        doc(db, "products", productId)
    );
} 