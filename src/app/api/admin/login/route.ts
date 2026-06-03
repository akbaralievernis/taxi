import { NextRequest, NextResponse } from 'next/server';
import { checkAdminCredentials, createSession, setSessionCookie } from '@/lib/auth';
import { verifyTotp } from '@/lib/totp';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { audit } from '@/lib/audit-log';

export async function POST(req: NextRequest) {
  // Strict rate-limit for login: 5 attempts / 5 min / IP
  const limited = checkRateLimit(req, { window: 5 * 60_000, max: 5, key: 'admin-login' });
  if (limited) {
    audit({ actor: 'anon', action: 'admin.login.rate_limited', ipAddress: getClientIp(req) }, req);
    return limited;
  }

  try {
    const { login, password, totpCode } = await req.json();

    if (!checkAdminCredentials(login, password)) {
      audit({
        actor: login ?? 'anon',
        action: 'admin.login.failed',
        ipAddress: getClientIp(req),
        metadata: { reason: 'bad-credentials' },
      }, req);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // If TOTP secret is configured in env, require code on every login.
    const adminTotpSecret = process.env.ADMIN_TOTP_SECRET;
    if (adminTotpSecret) {
      if (!totpCode) {
        return NextResponse.json({ error: '2FA code required', requires2fa: true }, { status: 401 });
      }
      if (!verifyTotp(adminTotpSecret, String(totpCode))) {
        audit({
          actor: login,
          action: 'admin.login.failed',
          ipAddress: getClientIp(req),
          metadata: { reason: 'bad-totp' },
        }, req);
        return NextResponse.json({ error: 'Invalid 2FA code', requires2fa: true }, { status: 401 });
      }
    }

    const token = await createSession(login);
    await setSessionCookie(token);

    audit({
      actor: login,
      action: 'admin.login.success',
      ipAddress: getClientIp(req),
      metadata: { with2fa: !!adminTotpSecret },
    }, req);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
