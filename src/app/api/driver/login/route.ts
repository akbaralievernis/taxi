import { NextRequest, NextResponse } from 'next/server';
import { getDrivers } from '@/lib/db';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { audit } from '@/lib/audit-log';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-secret-for-dev-only-please-change'
);

function normalizePhone(p: string): string {
  return p.replace(/\D/g, '');
}

export async function POST(req: NextRequest) {
  const limited = checkRateLimit(req, { window: 5 * 60_000, max: 5, key: 'driver-login' });
  if (limited) return limited;

  try {
    const { phone } = await req.json();
    if (!phone) {
      return NextResponse.json({ error: 'Phone required' }, { status: 400 });
    }
    const drivers = await getDrivers();
    const driver = drivers.find(d => normalizePhone(d.phone) === normalizePhone(phone));
    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
    }
    if (!driver.isActive || !driver.isVerified) {
      return NextResponse.json({ error: 'Driver not verified or inactive' }, { status: 403 });
    }

    const token = await new SignJWT({ driverId: driver.id, role: 'driver' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('30d')
      .sign(SECRET);

    const store = await cookies();
    store.set('driver_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    audit({
      actor: `driver:${driver.id}`,
      action: 'driver.login.success',
      ipAddress: getClientIp(req),
    }, req);

    return NextResponse.json({ success: true, driver: { id: driver.id, name: driver.name } });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
