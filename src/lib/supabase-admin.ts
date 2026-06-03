import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-side Supabase client with service_role key.
 * Bypasses RLS — only use in API routes / server components.
 * Never import this in 'use client' components.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!url || !serviceKey) return null;
  if (url.includes('placeholder')) return null;
  if (cached) return cached;

  cached = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: 'public' },
  });
  return cached;
}

export function isSupabaseConfigured(): boolean {
  return !!(url && serviceKey && !url.includes('placeholder'));
}
