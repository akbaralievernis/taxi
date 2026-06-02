import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrders, calculatePrice, findPromoByCode } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { notifyNewOrder } from '@/lib/integrations/telegram';
import { sendOrderConfirmation } from '@/lib/integrations/sms';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const required = ['customerName', 'customerPhone', 'fromCity', 'fromAddress', 'toCity', 'toAddress', 'carClass', 'paymentMethod'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    // Серверный пересчёт цены (нельзя верить клиенту)
    const priceResult = await calculatePrice({
      fromCity: body.fromCity,
      toCity: body.toCity,
      carClass: body.carClass,
      scheduledAt: body.scheduledAt,
    });

    let finalPrice = priceResult.price;

    // Применение промокода (серверная проверка)
    if (body.promoCode) {
      const promo = await findPromoByCode(String(body.promoCode));
      if (promo) {
        finalPrice = Math.round(finalPrice * (1 - promo.discount / 100));
      }
    }

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

    // Уведомления (асинхронно, не блокируют ответ)
    Promise.all([
      notifyNewOrder(order),
      sendOrderConfirmation(order.customerPhone, order.id, finalPrice),
    ]).catch(() => {});

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
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
