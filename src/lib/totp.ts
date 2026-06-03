import crypto from 'crypto';

/**
 * RFC 6238 TOTP implementation — compatible with Google Authenticator,
 * Authy, Microsoft Authenticator, 1Password, etc.
 *
 * Zero dependencies. Uses Node's built-in `crypto`.
 *
 * Usage:
 *   const secret = generateSecret();              // for user, store in DB
 *   const uri = otpauthUri({ label, issuer, secret });
 *   // Render QR code from `uri`
 *
 *   const valid = verifyTotp(secret, userCode);   // on login
 */

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; // base32

function base32Encode(buf: Buffer): string {
  let bits = 0;
  let value = 0;
  let out = '';
  for (const b of buf) {
    value = (value << 8) | b;
    bits += 8;
    while (bits >= 5) {
      out += ALPHABET[(value >> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) out += ALPHABET[(value << (5 - bits)) & 31];
  return out;
}

function base32Decode(s: string): Buffer {
  const cleaned = s.toUpperCase().replace(/=+$/, '').replace(/\s/g, '');
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const c of cleaned) {
    const idx = ALPHABET.indexOf(c);
    if (idx < 0) throw new Error('Invalid base32');
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      out.push((value >> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

export function generateSecret(bytes = 20): string {
  return base32Encode(crypto.randomBytes(bytes));
}

function hotp(secret: string, counter: number, digits = 6): string {
  const key = base32Decode(secret);
  const buf = Buffer.alloc(8);
  for (let i = 7; i >= 0; i--) {
    buf[i] = counter & 0xff;
    counter = Math.floor(counter / 256);
  }
  const hmac = crypto.createHmac('sha1', key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return (code % 10 ** digits).toString().padStart(digits, '0');
}

export function totp(secret: string, opts: { step?: number; t0?: number; digits?: number; t?: number } = {}): string {
  const step = opts.step ?? 30;
  const t0 = opts.t0 ?? 0;
  const t = opts.t ?? Math.floor(Date.now() / 1000);
  return hotp(secret, Math.floor((t - t0) / step), opts.digits ?? 6);
}

/**
 * Verify a user-entered TOTP code with ±1 window for clock skew.
 */
export function verifyTotp(secret: string, code: string, opts: { step?: number; t0?: number; digits?: number; window?: number } = {}): boolean {
  if (!secret || !code) return false;
  const clean = code.replace(/\s/g, '');
  if (!/^\d{6}$/.test(clean)) return false;

  const step = opts.step ?? 30;
  const window = opts.window ?? 1;
  const now = Math.floor(Date.now() / 1000);

  for (let w = -window; w <= window; w++) {
    if (totp(secret, { step, t0: opts.t0, digits: opts.digits, t: now + w * step }) === clean) {
      return true;
    }
  }
  return false;
}

/**
 * Build an otpauth:// URI to encode as a QR code for the user's
 * authenticator app.
 *   label  – usually "App Name (user@email)"
 *   issuer – your service name
 */
export function otpauthUri({ label, issuer, secret }: { label: string; issuer: string; secret: string }): string {
  const params = new URLSearchParams({ secret, issuer });
  return `otpauth://totp/${encodeURIComponent(`${issuer}:${label}`)}?${params}`;
}
