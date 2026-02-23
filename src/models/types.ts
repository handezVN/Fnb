/**
 * Shared types & enums for database models
 */

// ─── User & Role ─────────────────────────────────────────────────────────────
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  BRAND_ADMIN = 'BRAND_ADMIN',
  STORE_MANAGER = 'STORE_MANAGER',
  STAFF = 'STAFF',
}

export enum UserStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

// ─── Order ───────────────────────────────────────────────────────────────────
export enum OrderStatus {
  CREATED = 'CREATED',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  COD = 'COD',
}

// ─── Product options ─────────────────────────────────────────────────────────
export enum ProductOptionType {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
}

// ─── Subscription ────────────────────────────────────────────────────────────
export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
}

// ─── Audit ───────────────────────────────────────────────────────────────────
export type AuditEntityType = 'order' | 'user' | 'product';

export interface Timestamps {
  created_at: Date;
  updated_at: Date;
}
