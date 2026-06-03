import { createClient } from '@supabase/supabase-js';

// Supabase recently renamed anon_key → publishable_key. Support both names.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'placeholder';

// Browser-safe client. Uses anon/publishable key, respects Row-Level Security.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
