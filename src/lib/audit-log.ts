import { NextRequest } from 'next/server';
import { getSupabaseAdmin } from './supabase-admin';
import { getClientIp } from './rate-limit';

/**
 * Audit log — records all sensitive admin actions.
 *
 * Persisted to Supabase `audit_log` table when configured;
 * otherwise written to console for local debugging.
 */

export interface AuditEntry {
  actor: string;
  action: string;
  targetType?: string;
  targetId?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

/**
 * Record an audit event. Fire-and-forget — never throws to caller.
 */
export async function audit(entry: AuditEntry, req?: NextRequest): Promise<void> {
  const enriched = {
    actor: entry.actor,
    action: entry.action,
    target_type: entry.targetType ?? null,
    target_id: entry.targetId ?? null,
    ip_address: entry.ipAddress ?? (req ? getClientIp(req) : null),
    metadata: entry.metadata ?? null,
  };

  try {
    const sb = getSupabaseAdmin();
    if (sb) {
      await sb.from('audit_log').insert(enriched);
      return;
    }
    if (process.env.NODE_ENV !== 'production') {
      console.log('[audit]', enriched);
    }
  } catch (e) {
    // Audit must never break the request flow.
    console.error('[audit] failed to record:', e);
  }
}

export interface AuditQuery {
  limit?: number;
  actor?: string;
  action?: string;
  fromDate?: string;
}

/**
 * Fetch recent audit log entries (admin only).
 */
export async function getAuditEntries(query: AuditQuery = {}): Promise<any[]> {
  const sb = getSupabaseAdmin();
  if (!sb) return [];

  let q = sb.from('audit_log').select('*').order('created_at', { ascending: false }).limit(query.limit ?? 100);
  if (query.actor) q = q.eq('actor', query.actor);
  if (query.action) q = q.eq('action', query.action);
  if (query.fromDate) q = q.gte('created_at', query.fromDate);

  const { data, error } = await q;
  if (error) return [];
  return data ?? [];
}
