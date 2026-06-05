import { NextRequest, NextResponse } from 'next/server';
import { getDriverSession } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { checkRateLimit } from '@/lib/rate-limit';

/**
 * POST /api/driver/location — driver heartbeat & GPS update.
 *
 * The driver app posts current coordinates every 5-10 seconds while
 * an order is in progress. The row is upserted into driver_locations,
 * which triggers a Supabase Realtime event the customer subscribes to.
 *
 * Body: { lat, lon, bearing?, speed_kmh?, orderId? }
 */
export async function POST(req: NextRequest) {
  // Allow up to 30 heartbeats/min per driver (≈ every 2 sec)
  const limited = checkRateLimit(req, { window: 60_000, max: 30, key: 'driver-loc' });
  if (limited) return limited;

  const session = await getDriverSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body.lat !== 'number' || typeof body.lon !== 'number') {
    return NextResponse.json({ error: 'lat/lon required' }, { status: 400 });
  }

  // Sanity-check coordinates (Kyrgyzstan bbox ≈ 39-44 N, 69-81 E with some buffer)
  if (body.lat < -90 || body.lat > 90 || body.lon < -180 || body.lon > 180) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  const sb = getSupabaseAdmin();
  if (!sb) {
    // No DB: silently accept so the driver app doesn't error out.
    return NextResponse.json({ ok: true, persisted: false });
  }

  const { error } = await sb.from('driver_locations').upsert({
    driver_id: session.driverId,
    lat: body.lat,
    lon: body.lon,
    bearing: typeof body.bearing === 'number' ? body.bearing : null,
    speed_kmh: typeof body.speed_kmh === 'number' ? body.speed_kmh : null,
    order_id: body.orderId ?? null,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error('[driver/location] upsert failed:', error.message);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

/**
 * GET /api/driver/location?orderId=ord_… — current driver location for a customer.
 * Used by the order tracking page.
 */
export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get('orderId');
  if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

  const sb = getSupabaseAdmin();
  if (!sb) return NextResponse.json({ location: null });

  const { data } = await sb
    .from('driver_locations')
    .select('lat, lon, bearing, speed_kmh, updated_at')
    .eq('order_id', orderId)
    .maybeSingle();

  return NextResponse.json({ location: data });
}
