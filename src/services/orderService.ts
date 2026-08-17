import { addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../config/firebase";
import type { CartItem } from "../types/CartItem";
import type { Order, OrderStatus } from "../types/Order";

export async function createOrder(
    userId: string,
    items: CartItem[],
    total: number
) {
    const orderItems = items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        priceAtPurchase: item.product.price,
        quantity: item.quantity,
        ...(item.product.imageUrl
            ? { imageUrl: item.product.imageUrl }
            : {}),
    }));

    const orderRef = await addDoc(
        collection(db, "orders"),
        {
            userId,
            items: orderItems,
            total,
            status: "pending",
            createdAt: serverTimestamp(),
        }
    );

    return orderRef.id;
}

export async function getUserOrders(
    userId: string
): Promise<Order[]> {
    const ordersQuery = query(
        collection(db, "orders"),
        where("userId", "==", userId)
    );

    const snapshot = await getDocs(ordersQuery);

    const orders = snapshot.docs.map((document) => {
        const data = document.data();

        return {
            id: document.id,
            userId: data.userId,
            items: data.items,
            total: data.total,
            status: data.status,
            createdAt:
                data.createdAt?.toDate?.() ?? new Date(),
        } as Order;
    });

    return orders.sort(
        (a, b) =>
            b.createdAt.getTime() -
            a.createdAt.getTime()
    );
}

export async function getAllOrders(): Promise<Order[]> {
    const snapshot = await getDocs(
        collection(db, "orders")
    );

    const orders = snapshot.docs.map((document) => {
        const data = document.data();

        return {
            id: document.id,
            userId: data.userId,
            items: data.items,
            total: data.total,
            status: data.status,
            createdAt:
                data.createdAt?.toDate?.() ?? new Date(),
        } as Order;
    });

    return orders.sort(
        (a, b) =>
            b.createdAt.getTime() -
            a.createdAt.getTime()
    );
}

export async function updateOrderStatus(
    orderId: string,
    status: OrderStatus
) {
    const orderRef = doc(
        db,
        "orders",
        orderId
    );

    await updateDoc(orderRef, {
        status,
    });
}