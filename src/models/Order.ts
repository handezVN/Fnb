/**
 * ORDER MANAGEMENT (CORE)
 * order_number unique, status enum, payment_method COD
 */
import { OrderStatus, PaymentMethod } from './types';

export const ORDERS_TABLE = 'orders';

export interface Order {
  id: string;
  order_number: string;
  store_id: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  note: string | null;
  created_at: Date;
  confirmed_at: Date | null;
  completed_at: Date | null;
  cancelled_at: Date | null;
  updated_at?: Date;
}

export interface OrderCreateInput {
  order_number: string;
  store_id: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  status?: OrderStatus;
  payment_method?: PaymentMethod;
  note?: string | null;
}

export interface OrderUpdateInput {
  customer_name?: string;
  customer_phone?: string;
  total_amount?: number;
  status?: OrderStatus;
  payment_method?: PaymentMethod;
  note?: string | null;
  confirmed_at?: Date | null;
  completed_at?: Date | null;
  cancelled_at?: Date | null;
  updated_at?: Date;
}
