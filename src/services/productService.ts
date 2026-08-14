import {
    collection,
    getDocs,
} from "firebase/firestore";

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