// types/index.ts
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "cutting"
  | "production"
  | "packing"
  | "completed";

export interface Order {
  id: string;
  order_number: string;
  client_name: string;
  product_name: string;
  quantity: number;
  current_status: OrderStatus;
  estimated_date: string | null;
  created_at: string;
}

export interface OrderHistory {
  id: string;
  order_id: string;
  title: string;
  description: string;
  status: OrderStatus;
  created_at: string;
}
