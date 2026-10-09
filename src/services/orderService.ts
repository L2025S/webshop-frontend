import type { Order } from "../types/Order";
import type { OrderRequest } from "../types/OrderRequest";
import { ApiError } from "../errors/ApiError";

const ORDER_SERVICE_URL =
    import.meta.env.VITE_ORDER_SERVICE_URL || "http://localhost:8082";

export async function createOrder(orderRequest: OrderRequest): Promise<Order> {

    let response: Response;

    try {
        response = await fetch(`${ORDER_SERVICE_URL}/orders`, {
            method: "POST",
            credentials: "include",
            headers: {
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