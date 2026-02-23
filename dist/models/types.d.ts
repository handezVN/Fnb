/**
 * Shared types & enums for database models
 */
export declare enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    BRAND_ADMIN = "BRAND_ADMIN",
    STORE_MANAGER = "STORE_MANAGER",
    STAFF = "STAFF"
}
export declare enum UserStatus {
    ACTIVE = "active",
    DISABLED = "disabled"
}
export declare enum OrderStatus {
    CREATED = "CREATED",
    CONFIRMED = "CONFIRMED",
    PREPARING = "PREPARING",
    READY = "READY",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare enum PaymentMethod {
    COD = "COD"
}
export declare enum ProductOptionType {
    SINGLE = "single",
    MULTIPLE = "multiple"
}
export declare enum SubscriptionStatus {
    ACTIVE = "active",
    EXPIRED = "expired"
}
export type AuditEntityType = 'order' | 'user' | 'product';
export interface Timestamps {
    created_at: Date;
    updated_at: Date;
}
//# sourceMappingURL=types.d.ts.map