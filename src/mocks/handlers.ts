import { http, HttpResponse } from "msw";
import { mockUsers, mockProducts } from "./data";

    // Mock handler for fetching the authenticated user
export const handlers = [
  http.get("*/gateway/appusers/me", () => {
    return HttpResponse.json(mockUsers);
  }),

    // Mock handler for fetching all products
  http.get("*/gateway/products/all", () => {
    return HttpResponse.json(mockProducts);
  }),

    // Mock handler for fetching all categories
  http.get("*/gateway/categories/all", () => {
    return HttpResponse.json([]);
  })
];
