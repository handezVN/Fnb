/**
 * MENU SYSTEM - categories within a menu
 */
export declare const CATEGORIES_TABLE = "categories";
export interface Category {
    id: string;
    menu_id: string;
    name: string;
    sort_order: number;
    created_at?: Date;
    updated_at?: Date;
}
export interface CategoryCreateInput {
    menu_id: string;
    name: string;
    sort_order?: number;
}
export interface CategoryUpdateInput {
    name?: string;
    sort_order?: number;
}
//# sourceMappingURL=Category.d.ts.map