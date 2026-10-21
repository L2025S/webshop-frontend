import type { Product } from "../types/Product";
import { ApiError } from "../errors/ApiError";
import type { ProductRequest } from "../types/ProductRequest";

const PRODUCT_SERVICE_URL = import.meta.env.VITE_PRODUCT_SERVICE_URL;

export async function fetchAllProducts(): Promise<Product[]> {
  let response: Response;

  try {
    response = await fetch(`${PRODUCT_SERVICE_URL}/products/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (networkError) {
    console.error(networkError);
    throw new ApiError(
      "Could not connect to the server. Please check your network connection.",
    );
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new ApiError(
        "Your session has expired or you don't have permission. Please log in again.",
        response.status,
      );
    }

    throw new ApiError(
      `Failed to load products (status code: ${response.status})`,
      response.status,
    );
  }

  const data: Product[] = await response.json();
  return data;
}

export async function fetchProduct(productId: number): Promise<Product> {
  let response: Response;

  try {
    response = await fetch(`${PRODUCT_SERVICE_URL}/products/${productId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (networkError) {
    console.error(networkError);
    throw new ApiError(
      "Could not connect to the server. Please check your network connection.",
    );
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new ApiError(
        "Your session has expired or you don't have permission. Please log in again.",
        response.status,
      );
    }

    throw new ApiError(
      `Failed to load products (status code: ${response.status})`,
      response.status,
    );
  }

  const data: Product = await response.json();
  return data;
}


// The form gets the created product back, or an ApiError with a readable message

export async function createProduct ( newProduct: ProductRequest, ) : Promise<Product> {

        let response : Response;

        try {
            response = await fetch (`${PRODUCT_SERVICE_URL}/products/new`,{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",     
                },
                // The JWT lives in an HttpOnly cookie, so the browser msut be told to send it. 
                // Without this the backend sees an anonymous request and answer 401. 
                credentials: "include",
                body:JSON.stringify(newProduct),
                });
        } catch (networkError) {
            console.error(networkError);
            throw new ApiError (
                "Could not connect to the server. Please check your network connection."
            );
        }

        if (!response.ok){
            if( response.status === 401) {
                throw new ApiError(
                    "Your session has expired. Please log in again.",
                    response.status,
                );
            }


            if(response.status === 403) {
                throw new ApiError(
                    " You don't have permission to create products.",
                    response.status,
                );
            }


            // The product backend answer 400(validation) and 404 ( unknown category ) with plain text, not JSON
            // so we read the body with text() instead of json()

            if ( response.status === 400 || response.status === 404) {
                let serverMessage = "";
                try {
                    serverMessage = await response.text();

                } catch {
                    // Ignore: we fall back to the generic message below. 

                } 

                throw new ApiError (
                    serverMessage || `Could not create the product ( status code: ${ response.status})`,
                    response.status,
                );

            }


            throw new ApiError(
                    `Could not create the product (status code: ${response.status})`,
                    response.status,
                );   
        }

        const createdProduct: Product = await response.json();
        return createdProduct;


    };
    
    export async function deleteProduct(id: number): Promise<void> {
    const response = await fetch(
        `${PRODUCT_SERVICE_URL}/products/${id}`,
        {
            method: "DELETE",
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new ApiError(
            `Failed to delete product (status code: ${response.status})`,
            response.status
        );
      }
    }
    // Increases the stock of a product
export async function increaseProductStock(
  uuid: string,
  quantity: number
): Promise<Product> {
  const response = await fetch(
    `${PRODUCT_SERVICE_URL}/products/${uuid}/stock/increase?quantity=${quantity}`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new ApiError(
      `Failed to increase stock (status code: ${response.status})`,
      response.status
    );
  }

  return await response.json();
}

// Decreases the stock of a product
export async function decreaseProductStock(
  uuid: string,
  quantity: number
): Promise<Product> {
  const response = await fetch(
    `${PRODUCT_SERVICE_URL}/products/${uuid}/stock/reduce?quantity=${quantity}`,
    {
      method: "PATCH",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new ApiError(
      `Failed to decrease stock (status code: ${response.status})`,
      response.status
    );
  }

  return await response.json();
}
