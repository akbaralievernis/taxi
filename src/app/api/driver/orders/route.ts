import { NextResponse } from 'next/server';
import { getOrders, getDrivers } from '@/lib/db';
import { getDriverSession } from '@/lib/auth';

export async function GET() {
  const session = await getDriverSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const drivers = await getDrivers();
  const driver = drivers.find(d => d.id === session.driverId);
  if (!driver) return NextResponse.json({ error: 'Driver not found' }, { status: 404 });

  const orders = await getOrders();

  // Доступные заказы (pending в городе водителя или его машины класса) + свои текущие
  const available = orders.filter(o =>
    o.status === 'pending' &&
    (o.carClass === driver.carClass || driver.carClass === 'comfort')
  );

  const myOrders = orders.filter(o => o.driverId === session.driverId);

  return NextResponse.json({ driver, available, myOrders });
}
