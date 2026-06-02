import { NextRequest, NextResponse } from 'next/server';
import { findPromoByCode } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code required' }, { status: 400 });
    }
    const promo = await findPromoByCode(code.trim());
    if (!promo) {
      return NextResponse.json({ valid: false, error: 'Промокод недействителен или истёк' }, { status: 404 });
    }
    return NextResponse.json({
      valid: true,
      discount: promo.discount,
      code: promo.code,
    });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
