import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { generateSecret, otpauthUri, verifyTotp } from '@/lib/totp';

/**
 * 2FA TOTP setup endpoint.
 *
 * GET   → generate a fresh secret + QR code URL
 * POST  → verify a 6-digit code against the given secret
 *
 * Setup workflow:
 *   1. Open /admin/dashboard/security
 *   2. Scan QR with Google Authenticator / Authy / 1Password
 *   3. Enter the 6-digit code to verify
 *   4. If verified — save the secret to Vercel env as ADMIN_TOTP_SECRET
 *   5. Redeploy; from then on, every admin login requires the code.
 */
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const secret = generateSecret();
  const uri = otpauthUri({
    label: session.username,
    issuer: 'Taxi KG',
    secret,
  });

  return NextResponse.json({
    secret,
    uri,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(uri)}`,
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { secret, code } = await req.json();
  if (!secret || !code) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

  const valid = verifyTotp(String(secret), String(code));
  return NextResponse.json({ valid });
}
