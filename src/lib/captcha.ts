/**
 * Lightweight bot mitigation — no external services required.
 *
 * Two layers:
 *   1. Honeypot:   a hidden form field bots auto-fill but humans don't.
 *   2. Time-check: bots submit forms instantly; humans take ≥ 2.5 sec.
 *
 * Both signals are sent from the client in the request body:
 *   { ...formData, _hp: '', _t: 1735847123456 }
 *
 * Server rejects if honeypot non-empty or time delta is too small.
 *
 * For higher-stakes flows, swap this for hCaptcha/Turnstile (drop-in interface).
 */

export interface CaptchaPayload {
  _hp?: string;
  _t?: number;
}

const MIN_FILL_TIME_MS = 2500;
const MAX_FILL_TIME_MS = 1000 * 60 * 60 * 2; // 2 hours — token expires

export function isBot(payload: CaptchaPayload): { bot: boolean; reason?: string } {
  // Honeypot: if filled, it's a bot.
  if (payload._hp && payload._hp.trim().length > 0) {
    return { bot: true, reason: 'honeypot' };
  }

  // Time-check: token must exist and be within reasonable window.
  const ts = payload._t;
  if (!ts || typeof ts !== 'number' || isNaN(ts)) {
    return { bot: true, reason: 'missing-timestamp' };
  }

  const delta = Date.now() - ts;
  if (delta < MIN_FILL_TIME_MS) {
    return { bot: true, reason: 'too-fast' };
  }
  if (delta > MAX_FILL_TIME_MS) {
    return { bot: true, reason: 'too-slow' };
  }

  return { bot: false };
}
