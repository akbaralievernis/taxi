import { NextRequest, NextResponse } from 'next/server';
import { updateTariff } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const tariff = await updateTariff(id, body);
  if (!tariff) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(tariff);
}
