import type { Product } from "../types/Product";
import { ApiError } from "../errors/ApiError";

const PRODUCT_SERVICE_URL= import.meta.env.VITE_PRODUCT_SERVICE_URL;

export async function fetchAllProducts(): Promise<Product[]> {
    const token = sessionStorage.getItem("accessToken");

    if(!token) {
        throw new ApiError ("You are not logged in. Please log in to view products.");
    }

    let response: Response;

    try {
        response = await fetch (`${PRODUCT_SERVICE_URL}/products/all`, {
            method:"GET",
            headers: {
               ...(token ? {Authorization: `Bearer ${token}` } : {}),
                "Content-Type": "application/json",
            },
        });

    } catch (networkError) {
        console.error(networkError);
        throw new ApiError ("Could not connect to the server. Please check your network connection.");

    }

    if (!response.ok){
        if(response.status === 401 || response.status === 403) {
            throw new ApiError ("Your session has expired or you don't have permission. Please log in again.", response.status);
        }

        throw new ApiError ( 
            `Failed to load products (status code: ${response.status})`,
            response.status
        );
    }

    const data: Product[] = await response.json();
    return data;
};