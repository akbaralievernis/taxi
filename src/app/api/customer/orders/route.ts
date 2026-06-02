import { NextRequest, NextResponse } from 'next/server';
import { getOrders } from '@/lib/db';

function normalizePhone(p: string): string {
  return p.replace(/\D/g, '');
}

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get('phone') ?? '';
  if (!phone || phone.length < 9) {
    return NextResponse.json({ error: 'Phone required' }, { status: 400 });
  }
  const normalized = normalizePhone(phone);
  const orders = await getOrders();
  const filtered = orders.filter(o => normalizePhone(o.customerPhone) === normalized);
  return NextResponse.json(filtered);
}
