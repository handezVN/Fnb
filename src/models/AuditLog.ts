/**
 * AUDIT LOG (BẮT BUỘC)
 * entity_type: order | user | product
 * Ví dụ: order confirmed, order cancelled, price updated
 */
import { AuditEntityType } from './types';

export const AUDIT_LOGS_TABLE = 'audit_logs';

export interface AuditLog {
  id: string;
  entity_type: AuditEntityType;
  entity_id: string;
  action: string;
  actor_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: Date;
}

export interface AuditLogCreateInput {
  entity_type: AuditEntityType;
  entity_id: string;
  action: string;
  actor_id?: string | null;
  metadata?: Record<string, unknown> | null;
}
