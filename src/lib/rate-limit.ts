import { NextRequest, NextResponse } from 'next/server';

/**
 * In-memory token-bucket rate limiter.
 *
 * Limits the number of requests per IP+route within a sliding window.
 * Survives within a single Vercel function container — for a distributed
 * limit at scale, swap the Map for Upstash Redis (drop-in interface).
 *
 * Usage in API route:
 *   const limited = checkRateLimit(req, { window: 60_000, max: 5 });
 *   if (limited) return limited;
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Periodically clean stale buckets to keep memory bounded.
let lastCleanup = Date.now();
function cleanup(now: number) {
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;
  for (const [k, b] of buckets) {
    if (b.resetAt < now) buckets.delete(k);
  }
}

export function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  const real = req.headers.get('x-real-ip');
  if (real) return real;
  return 'unknown';
}

export interface RateLimitOptions {
  /** Window length in ms (default: 60 000 = 1 min) */
  window?: number;
  /** Max allowed hits within the window (default: 10) */
  max?: number;
  /** Custom bucket-key suffix to isolate different actions */
  key?: string;
}

/**
 * Returns null if under the limit, or a 429 NextResponse if rate-limited.
 */
export function checkRateLimit(
  req: NextRequest,
  opts: RateLimitOptions = {}
): NextResponse | null {
  const window = opts.window ?? 60_000;
  const max = opts.max ?? 10;
  const ip = getClientIp(req);
  const path = new URL(req.url).pathname;
  const key = `${ip}:${opts.key ?? path}`;
  const now = Date.now();

  cleanup(now);

  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    bucket = { count: 0, resetAt: now + window };
    buckets.set(key, bucket);
  }

  bucket.count++;

  if (bucket.count > max) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: `Превышен лимит запросов. Попробуйте через ${retryAfter} сек.`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(max),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(bucket.resetAt),
        },
      }
    );
  }

  return null;
}
