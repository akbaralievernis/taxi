import { NextRequest, NextResponse } from 'next/server';
import { getDrivers, createDriver } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const drivers = await getDrivers();
  return NextResponse.json(drivers);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const required = ['name', 'phone', 'city', 'carModel', 'carNumber', 'carClass'];
  for (const f of required) {
    if (!body[f]) return NextResponse.json({ error: `Missing ${f}` }, { status: 400 });
  }

  const driver = await createDriver({
    name: body.name,
    phone: body.phone,
    city: body.city,
    carModel: body.carModel,
    carNumber: body.carNumber,
    carClass: body.carClass,
    isActive: body.isActive ?? true,
    isVerified: body.isVerified ?? false,
  });
  return NextResponse.json(driver, { status: 201 });
}
