/**
 * MENU SYSTEM - product options (size / topping)
 * type: single | multiple, required: boolean
 */
import { ProductOptionType } from './types';
export declare const PRODUCT_OPTIONS_TABLE = "product_options";
export interface ProductOption {
    id: string;
    product_id: string;
    name: string;
    type: ProductOptionType;
    required: boolean;
    created_at?: Date;
    updated_at?: Date;
}
export interface ProductOptionCreateInput {
    product_id: string;
    name: string;
    type: ProductOptionType;
    required?: boolean;
}
export interface ProductOptionUpdateInput {
    name?: string;
    type?: ProductOptionType;
    required?: boolean;
}
//# sourceMappingURL=ProductOption.d.ts.map