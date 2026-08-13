export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    imageUrl?: string;
    stock: number;
    createdAt?: Date;
    updatedAt?: Date;
}