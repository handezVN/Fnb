/**
 * MENU SYSTEM - products in a category
 */
export declare const PRODUCTS_TABLE = "products";
export interface Product {
    id: string;
    category_id: string;
    name: string;
    description: string | null;
    price: number;
    image_url: string | null;
    is_available: boolean;
    sort_order: number;
    created_at: Date;
    updated_at: Date;
}
export interface ProductCreateInput {
    category_id: string;
    name: string;
    description?: string | null;
    price: number;
    image_url?: string | null;
    is_available?: boolean;
    sort_order?: number;
}
export interface ProductUpdateInput {
    name?: string;
    description?: string | null;
    price?: number;
    image_url?: string | null;
    is_available?: boolean;
    sort_order?: number;
    updated_at?: Date;
}
//# sourceMappingURL=Product.d.ts.map