import type { Category } from "./Category";

export type Product = {
    id: number;
    uuid:string;
    name:string;
    imageUrl: string | null;
    price:number;
    description: string;
    stock:number;
    category: Category | null;
    createdAt:string;
    updatedAt:string;
};