/**
 * ORDER MANAGEMENT - order items (snapshot of product at order time)
 * product_name, base_price, quantity, subtotal - snapshot để giữ đúng order cũ khi menu đổi giá
 */
export const ORDER_ITEMS_TABLE = 'order_items';

export interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  base_price: number;
  quantity: number;
  subtotal: number;
  created_at?: Date;
}

export interface OrderItemCreateInput {
  order_id: string;
  product_name: string;
  base_price: number;
  quantity: number;
  subtotal: number;
}
