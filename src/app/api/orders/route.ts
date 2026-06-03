import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrders, calculatePrice, findPromoByCode, updatePromo } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { notifyNewOrder } from '@/lib/integrations/telegram';
import { sendOrderConfirmation as smsConfirmation } from '@/lib/integrations/sms';
import { sendOrderConfirmation as emailConfirmation, notifyAdminNewOrder } from '@/lib/email';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { isBot } from '@/lib/captcha';
import { audit } from '@/lib/audit-log';

export async function POST(req: NextRequest) {
  // 1. Rate limit: max 5 orders / minute / IP
  const limited = checkRateLimit(req, { window: 60_000, max: 5, key: 'order' });
  if (limited) {
    audit({ actor: 'anon', action: 'order.rate_limited', ipAddress: getClientIp(req) }, req);
    return limited;
  }

  try {
    const body = await req.json();

    // 2. Bot mitigation (honeypot + time-check)
    const botCheck = isBot(body);
    if (botCheck.bot) {
      audit({
        actor: 'anon',
        action: 'order.bot_blocked',
        ipAddress: getClientIp(req),
        metadata: { reason: botCheck.reason },
      }, req);
      // Mimic success to not give bots feedback
      return NextResponse.json({ id: 'ord_blocked', status: 'pending' }, { status: 201 });
    }

    // 3. Validation
    const required = ['customerName', 'customerPhone', 'fromCity', 'fromAddress', 'toCity', 'toAddress', 'carClass', 'paymentMethod'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    // 4. Server-side price recalculation (trust no client)
    const priceResult = await calculatePrice({
      fromCity: body.fromCity,
      toCity: body.toCity,
      carClass: body.carClass,
      scheduledAt: body.scheduledAt,
    });

    let finalPrice = priceResult.price;
    let promoCode: string | undefined;

    // 5. Server-side promo application
    if (body.promoCode) {
      const promo = await findPromoByCode(String(body.promoCode));
      if (promo) {
        finalPrice = Math.round(finalPrice * (1 - promo.discount / 100));
        promoCode = promo.code;
        // Increment usage counter (fire-and-forget)
        updatePromo(promo.id, { usedCount: promo.usedCount + 1 }).catch(() => {});
      }
    }

    // 6. Create order
    const order = await createOrder({
      customerName: String(body.customerName).slice(0, 100),
      customerPhone: String(body.customerPhone).slice(0, 30),
      fromCity: body.fromCity,
      fromAddress: String(body.fromAddress).slice(0, 200),
      toCity: body.toCity,
      toAddress: String(body.toAddress).slice(0, 200),
      scheduledAt: body.scheduledAt ?? new Date().toISOString(),
      passengers: Math.min(Math.max(1, Number(body.passengers) || 1), 8),
      luggage: Math.min(Math.max(0, Number(body.luggage) || 0), 10),
      carClass: body.carClass,
      paymentMethod: body.paymentMethod,
      comment: body.comment ? String(body.comment).slice(0, 500) : undefined,
      estimatedPrice: finalPrice,
    });

    // 7. Audit log
    audit({
      actor: 'customer',
      action: 'order.created',
      targetType: 'order',
      targetId: order.id,
      ipAddress: getClientIp(req),
      metadata: { route: `${order.fromCity}→${order.toCity}`, price: finalPrice, promoCode },
    }, req);

    // 8. Notifications (async, never block response)
    Promise.all([
      notifyNewOrder(order),
      smsConfirmation(order.customerPhone, order.id, finalPrice),
      body.customerEmail ? emailConfirmation(body.customerEmail, order) : Promise.resolve(),
      notifyAdminNewOrder(order),
    ]).catch((e) => console.error('[notifications] failed:', e));

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    return NextResponse.json(await getOrders());
  } catch {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
