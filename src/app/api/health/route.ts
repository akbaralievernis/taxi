import { NextResponse } from 'next/server';
import { checkDbHealth, isSupabaseConfigured } from '@/lib/db';
import { isEmailConfigured } from '@/lib/email';
import { isTelegramConfigured } from '@/lib/integrations/telegram';
import { isSmsConfigured } from '@/lib/integrations/sms';
import { isMapsConfigured } from '@/lib/integrations/maps';

/**
 * Health-check endpoint.
 * Reports the state of every external dependency.
 * Public — safe to expose, returns no secrets.
 */
export async function GET() {
  const db = await checkDbHealth();
  const integrations = {
    supabase: isSupabaseConfigured(),
    email: isEmailConfigured(),
    telegram: isTelegramConfigured(),
    sms: isSmsConfigured(),
    maps: isMapsConfigured(),
    twofa: !!process.env.ADMIN_TOTP_SECRET,
  };

  const status = db.ok ? 'healthy' : 'degraded';

  return NextResponse.json({
    status,
    timestamp: new Date().toISOString(),
    version: '4.0',
    database: db,
    integrations,
  }, {
    status: db.ok ? 200 : 503,
    headers: { 'Cache-Control': 'no-store' },
  });
}
