/**
 * MENU SYSTEM - store-level menu
 */
export const MENUS_TABLE = 'menus';

export interface Menu {
  id: string;
  store_id: string;
  name: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface MenuCreateInput {
  store_id: string;
  name: string;
  is_active?: boolean;
}

export interface MenuUpdateInput {
  name?: string;
  is_active?: boolean;
  updated_at?: Date;
}
