export type Order = {
  id: number;
  orderDate: string;
  customerName: string;
  orderItems: OrderItemResponse[];
  totalPrice: number;
};

export type OrderItemResponse = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};
