/**
 * USER & ROLE SYSTEM
 * users
 * - BRAND_ADMIN → store_id = null
 * - STORE_MANAGER | STAFF → store_id = store uuid
 */
import { Role, UserStatus } from './types';
export declare const USERS_TABLE = "users";
export interface User {
    id: string;
    email: string;
    password_hash: string;
    full_name: string;
    phone: string | null;
    role: Role;
    store_id: string | null;
    status: UserStatus;
    created_at: Date;
    updated_at: Date;
}
export interface UserCreateInput {
    email: string;
    password_hash: string;
    full_name: string;
    phone?: string | null;
    role: Role;
    store_id?: string | null;
    status?: UserStatus;
}
export interface UserUpdateInput {
    full_name?: string;
    phone?: string | null;
    role?: Role;
    store_id?: string | null;
    status?: UserStatus;
    password_hash?: string;
    updated_at?: Date;
}
//# sourceMappingURL=User.d.ts.map