import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrder } from '@/lib/db';
import { getDriverSession } from '@/lib/auth';
import { OrderStatus } from '@/types';

const ALLOWED: OrderStatus[] = ['in_progress', 'completed', 'cancelled'];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getDriverSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();
  if (!ALLOWED.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const order = await getOrderById(id);
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (order.driverId !== session.driverId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const updated = await updateOrder(id, { status });
  return NextResponse.json(updated);
}
