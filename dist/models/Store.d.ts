/**
 * STORE MANAGEMENT
 */
export declare const STORES_TABLE = "stores";
export interface Store {
    id: string;
    name: string;
    address: string;
    phone: string | null;
    opening_time: string | null;
    closing_time: string | null;
    is_open: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface StoreCreateInput {
    name: string;
    address: string;
    phone?: string | null;
    opening_time?: string | null;
    closing_time?: string | null;
    is_open?: boolean;
}
export interface StoreUpdateInput {
    name?: string;
    address?: string;
    phone?: string | null;
    opening_time?: string | null;
    closing_time?: string | null;
    is_open?: boolean;
    updated_at?: Date;
}
//# sourceMappingURL=Store.d.ts.map