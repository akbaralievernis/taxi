import { NextRequest, NextResponse } from 'next/server';
import { calculatePrice } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await calculatePrice({
      fromCity: body.fromCity ?? 'Бишкек',
      toCity: body.toCity ?? 'Бишкек',
      carClass: body.carClass ?? 'economy',
      scheduledAt: body.scheduledAt,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to calculate price' }, { status: 500 });
  }
}
