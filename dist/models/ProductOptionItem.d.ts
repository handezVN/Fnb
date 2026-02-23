/**
 * MENU SYSTEM - option items (e.g. size M, topping cheese)
 */
export declare const PRODUCT_OPTION_ITEMS_TABLE = "product_option_items";
export interface ProductOptionItem {
    id: string;
    product_option_id: string;
    name: string;
    price_adjustment: number;
    created_at?: Date;
    updated_at?: Date;
}
export interface ProductOptionItemCreateInput {
    product_option_id: string;
    name: string;
    price_adjustment?: number;
}
export interface ProductOptionItemUpdateInput {
    name?: string;
    price_adjustment?: number;
}
//# sourceMappingURL=ProductOptionItem.d.ts.map