import { ApiError } from "../errors/ApiError";
import type { Category } from "../types/Category";

const PRODUCT_SERVICE_URL = import.meta.env.VITE_PRODUCT_SERVICE_URL;

export async function fetchAllCategories(): Promise<Category[]> {
    let response: Response;

    try {
        response = await fetch (`${PRODUCT_SERVICE_URL}/categories/all`,{
            method: "GET",
        });
    } catch (networkError){
        console.error(networkError);
        throw new ApiError("Could not connect to the server. please check your network connection.");
    }

    if(!response.ok){
        throw new ApiError(
            `Failed to load categories (status code: ${response.status})`,
            response.status
        );
    }

    const data: Category[] = await response.json();
    return data;
}