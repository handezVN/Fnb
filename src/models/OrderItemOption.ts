/**
 * ORDER MANAGEMENT - snapshot of selected options per order item
 */
export const ORDER_ITEM_OPTIONS_TABLE = 'order_item_options';

export interface OrderItemOption {
  id: string;
  order_item_id: string;
  option_name: string;
  option_item_name: string;
  price_adjustment: number;
  created_at?: Date;
}

export interface OrderItemOptionCreateInput {
  order_item_id: string;
  option_name: string;
  option_item_name: string;
  price_adjustment?: number;
}
