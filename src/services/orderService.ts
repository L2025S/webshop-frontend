import type { Order } from "../types/Order";
import type { OrderRequest } from "../types/OrderRequest";
import { ApiError } from "../errors/ApiError";
//order url if not in env use localhost
const ORDER_SERVICE_URL = import.meta.env.VITE_ORDER_SERVICE_URL || "http://localhost:8082";


//create order by user send to backend
export async function createOrder(orderRequest: OrderRequest): Promise<Order> {
    const token = localStorage.getItem("accessToken");


    //backend response
    let response: Response;

    try {
        response = await fetch(`${ORDER_SERVICE_URL}/order`, {
            method: "POST",
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderRequest),
        });

    } catch (networkError) {
        console.error(networkError);
        throw new ApiError(
            "Could not connect to the Order Service."
        );
    }

    if (!response.ok) {
        throw new ApiError(
            `Failed to create order (status code: ${response.status})`,
            response.status
        );
    }

    const data: Order = await response.json();

    return data;
}