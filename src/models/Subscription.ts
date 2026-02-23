/**
 * SUBSCRIPTION (MONETIZATION)
 */
import { SubscriptionStatus } from './types';

export const SUBSCRIPTIONS_TABLE = 'subscriptions';

export interface Subscription {
  id: string;
  plan_name: string;
  start_date: Date;
  end_date: Date;
  status: SubscriptionStatus;
  max_store: number;
  monthly_price: number;
  created_at: Date;
  updated_at?: Date;
}

export interface SubscriptionCreateInput {
  plan_name: string;
  start_date: Date;
  end_date: Date;
  status?: SubscriptionStatus;
  max_store: number;
  monthly_price: number;
}

export interface SubscriptionUpdateInput {
  plan_name?: string;
  end_date?: Date;
  status?: SubscriptionStatus;
  max_store?: number;
  monthly_price?: number;
  updated_at?: Date;
}
