/**
 * STORE SETTINGS (per store config)
 */
export declare const STORE_SETTINGS_TABLE = "store_settings";
export interface StoreSetting {
    id: string;
    store_id: string;
    auto_confirm: boolean;
    prep_time_default: number;
    allow_cancel_after_confirm: boolean;
    created_at?: Date;
    updated_at?: Date;
}
export interface StoreSettingCreateInput {
    store_id: string;
    auto_confirm?: boolean;
    prep_time_default?: number;
    allow_cancel_after_confirm?: boolean;
}
export interface StoreSettingUpdateInput {
    auto_confirm?: boolean;
    prep_time_default?: number;
    allow_cancel_after_confirm?: boolean;
}
//# sourceMappingURL=StoreSetting.d.ts.map