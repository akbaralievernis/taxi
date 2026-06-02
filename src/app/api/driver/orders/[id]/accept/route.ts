import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, getDrivers, updateOrder } from '@/lib/db';
import { getDriverSession } from '@/lib/auth';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getDriverSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (order.status !== 'pending') {
    return NextResponse.json({ error: 'Order already taken' }, { status: 409 });
  }

  const drivers = await getDrivers();
  const driver = drivers.find(d => d.id === session.driverId);
  if (!driver) return NextResponse.json({ error: 'Driver not found' }, { status: 404 });

  const updated = await updateOrder(id, {
    status: 'accepted',
    driverId: driver.id,
    driverName: driver.name,
    driverPhone: driver.phone,
    carModel: driver.carModel,
    carNumber: driver.carNumber,
  });

  return NextResponse.json(updated);
}
