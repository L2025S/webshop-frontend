export type OrderItemRequest = {
  productId: number;
  quantity: number;
};

export type OrderRequest = {
  items: OrderItemRequest[];
};