/**
 * Transactional email via Resend.
 *
 * Setup:
 *   1. Sign up at https://resend.com (free tier: 100 emails/day, 3K/mo)
 *   2. Verify your domain (or use the test address for dev)
 *   3. Get an API key
 *   4. Add to env:
 *        RESEND_API_KEY=re_...
 *        EMAIL_FROM='Taxi KG <noreply@yourdomain.com>'
 *        ADMIN_EMAIL=info@yourdomain.com   (where new-order notifications go)
 *
 * If RESEND_API_KEY is not set, all calls become silent no-ops.
 * Errors are caught and never thrown to the caller.
 */

import { Order } from '@/types';

const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM ?? 'Taxi KG <onboarding@resend.dev>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export function isEmailConfigured(): boolean {
  return !!API_KEY;
}

interface SendOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(opts: SendOptions): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!API_KEY) return { ok: false, error: 'not-configured' };

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: Array.isArray(opts.to) ? opts.to : [opts.to],
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
        reply_to: opts.replyTo,
      }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error('[email] failed:', json);
      return { ok: false, error: json?.message ?? `HTTP ${res.status}` };
    }
    return { ok: true, id: json?.id };
  } catch (e: any) {
    console.error('[email] error:', e);
    return { ok: false, error: e?.message ?? 'unknown' };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TEMPLATES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function priceFmt(n: number): string {
  return new Intl.NumberFormat('ru-RU').format(n) + ' сом';
}

function whenFmt(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Taxi KG</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Inter,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="max-width:600px;width:100%;margin:32px auto;background:#0a0e1a;border-radius:16px;overflow:hidden;">
    <tr>
      <td style="padding:24px;background:linear-gradient(135deg,#6366f1,#a855f7,#22d3ee);">
        <div style="font-size:24px;font-weight:800;color:#fff;letter-spacing:-0.5px;">⚡ TAXI KG</div>
        <div style="font-size:12px;color:rgba(255,255,255,0.85);margin-top:4px;">Премиум-такси по Кыргызстану</div>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 24px;color:#cbd5e1;font-size:15px;line-height:1.65;">
        ${content}
      </td>
    </tr>
    <tr>
      <td style="padding:18px;background:#050508;text-align:center;color:#64748b;font-size:12px;">
        © Taxi KG · Бишкек · Ош · 24/7<br>
        Это автоматическое сообщение — отвечать на него не нужно.
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendOrderConfirmation(email: string, order: Order): Promise<void> {
  if (!isEmailConfigured()) return;

  const html = baseLayout(`
    <h2 style="color:#fff;font-size:22px;margin:0 0 16px;">✅ Заказ принят!</h2>
    <p style="margin:0 0 16px;">Спасибо за выбор Taxi KG! Ваш заказ зарегистрирован.</p>

    <table cellpadding="12" cellspacing="0" style="width:100%;background:#0c0e1c;border-radius:12px;margin-bottom:20px;">
      <tr>
        <td style="color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;padding-bottom:4px;">Номер заказа</td>
      </tr>
      <tr><td style="font-family:monospace;color:#a5b4fc;font-size:15px;padding:0 12px 12px;">${order.id}</td></tr>
    </table>

    <table cellpadding="8" cellspacing="0" style="width:100%;color:#cbd5e1;font-size:14px;">
      <tr><td style="color:#64748b;width:140px;">Откуда:</td><td>${order.fromCity}, ${order.fromAddress}</td></tr>
      <tr><td style="color:#64748b;">Куда:</td><td>${order.toCity}, ${order.toAddress}</td></tr>
      <tr><td style="color:#64748b;">Когда:</td><td>${whenFmt(order.scheduledAt)}</td></tr>
      <tr><td style="color:#64748b;">Пассажиров:</td><td>${order.passengers} · Багаж: ${order.luggage}</td></tr>
      <tr><td style="color:#64748b;">Класс:</td><td style="text-transform:capitalize;">${order.carClass}</td></tr>
      <tr><td style="color:#64748b;">Оплата:</td><td style="text-transform:capitalize;">${order.paymentMethod}</td></tr>
    </table>

    <div style="margin:24px 0;padding:18px;background:linear-gradient(135deg,rgba(99,102,241,0.15),rgba(168,85,247,0.10));border:1px solid rgba(99,102,241,0.30);border-radius:12px;text-align:center;">
      <div style="color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Стоимость</div>
      <div style="color:#fff;font-size:32px;font-weight:800;background:linear-gradient(90deg,#a5b4fc,#c084fc,#67e8f9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${priceFmt(order.finalPrice ?? order.estimatedPrice)}</div>
    </div>

    <p style="color:#94a3b8;font-size:13px;margin:24px 0 0;">
      Мы свяжемся с вами в ближайшие <strong style="color:#fff;">5 минут</strong> для подтверждения.
      Если будут вопросы — звоните <a href="tel:+996555000000" style="color:#a5b4fc;text-decoration:none;">+996 555 000 000</a>.
    </p>
  `);

  await sendEmail({
    to: email,
    subject: `✅ Заказ ${order.id} принят — Taxi KG`,
    html,
    text: `Заказ ${order.id} принят. ${order.fromCity} → ${order.toCity}. ${priceFmt(order.finalPrice ?? order.estimatedPrice)}. Позвоним для подтверждения.`,
  });
}

export async function notifyAdminNewOrder(order: Order): Promise<void> {
  if (!isEmailConfigured() || !ADMIN_EMAIL) return;

  const html = baseLayout(`
    <h2 style="color:#fff;font-size:22px;margin:0 0 16px;">🚖 Новый заказ</h2>
    <p style="margin:0 0 20px;color:#94a3b8;">Поступил новый заказ в админку.</p>

    <table cellpadding="8" cellspacing="0" style="width:100%;color:#cbd5e1;font-size:14px;background:#0c0e1c;border-radius:12px;">
      <tr><td style="color:#64748b;width:140px;padding:14px;">Клиент:</td><td style="padding:14px;"><strong>${order.customerName}</strong><br><a href="tel:${order.customerPhone}" style="color:#a5b4fc;">${order.customerPhone}</a></td></tr>
      <tr><td style="color:#64748b;padding:14px;">Маршрут:</td><td style="padding:14px;">${order.fromCity}, ${order.fromAddress}<br>↓<br>${order.toCity}, ${order.toAddress}</td></tr>
      <tr><td style="color:#64748b;padding:14px;">Когда:</td><td style="padding:14px;">${whenFmt(order.scheduledAt)}</td></tr>
      <tr><td style="color:#64748b;padding:14px;">Класс:</td><td style="padding:14px;text-transform:capitalize;">${order.carClass} · ${order.passengers} чел · ${order.luggage} багаж</td></tr>
      <tr><td style="color:#64748b;padding:14px;">Цена:</td><td style="padding:14px;color:#a5b4fc;font-weight:700;font-size:18px;">${priceFmt(order.finalPrice ?? order.estimatedPrice)}</td></tr>
      ${order.comment ? `<tr><td style="color:#64748b;padding:14px;">Коммент:</td><td style="padding:14px;font-style:italic;">${order.comment}</td></tr>` : ''}
    </table>

    <p style="margin:24px 0 0;color:#94a3b8;font-size:13px;">ID: <code style="color:#fff;">${order.id}</code></p>
  `);

  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `🚖 Новый заказ — ${order.fromCity} → ${order.toCity}`,
    html,
    replyTo: undefined,
  });
}
