import { http, HttpResponse } from "msw";
import { mockUsers, mockProducts } from "./data";

export const handlers = [
  http.get("*/gateway/appusers/me", () => {
    return HttpResponse.json(mockUsers);
  }),

  http.get("*/gateway/products", () => {
    return HttpResponse.json(mockProducts);
  }),

  http.get("*/gateway/categories/all", () => {
    return HttpResponse.json([]);
  })
];
