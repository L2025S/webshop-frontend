
// Shape of the JSON body sent to POST/products/new.
// It mirrors ProductRequestDTO in the product service.
export type ProductRequest = {
    name: string;
    imageUrl: string | null;
    price: number;
    description: string;
    stock: number;
    categoryId: number | null;
};