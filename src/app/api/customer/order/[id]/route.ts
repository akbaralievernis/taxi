import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrder } from '@/lib/db';

function normalizePhone(p: string): string {
  return p.replace(/\D/g, '');
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const phone = req.nextUrl.searchParams.get('phone') ?? '';
  const order = await getOrderById(id);
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (normalizePhone(order.customerPhone) !== normalizePhone(phone)) {
    return NextResponse.json({ error: 'Phone mismatch' }, { status: 403 });
  }
  return NextResponse.json(order);
}

// Клиент может отменить только свой заказ и только если pending/accepted
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { phone } = await req.json();
  const order = await getOrderById(id);
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (normalizePhone(order.customerPhone) !== normalizePhone(phone)) {
    return NextResponse.json({ error: 'Phone mismatch' }, { status: 403 });
  }
  if (!['pending', 'accepted'].includes(order.status)) {
    return NextResponse.json({ error: 'Cannot cancel' }, { status: 400 });
  }
  const updated = await updateOrder(id, { status: 'cancelled' });
  return NextResponse.json(updated);
}
