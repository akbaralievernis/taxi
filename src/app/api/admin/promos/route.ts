import { NextRequest, NextResponse } from 'next/server';
import { getPromos } from '@/lib/db';
import { getSession } from '@/lib/auth';
import fs from 'fs/promises';
import path from 'path';
import { Promo } from '@/types';

const PROMOS_FILE = path.join(process.cwd(), 'src', 'data', 'promos.json');

async function writePromos(promos: Promo[]) {
  await fs.mkdir(path.dirname(PROMOS_FILE), { recursive: true });
  await fs.writeFile(PROMOS_FILE, JSON.stringify(promos, null, 2));
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json(await getPromos());
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (!body.code || !body.discount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const promos = await getPromos();
  const promo: Promo = {
    id: `promo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    code: String(body.code).toUpperCase().trim(),
    discount: Math.min(Math.max(1, Number(body.discount)), 100),
    validUntil: body.validUntil ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    maxUses: Math.max(1, Number(body.maxUses) || 100),
    usedCount: 0,
    isActive: body.isActive ?? true,
  };
  promos.push(promo);
  await writePromos(promos);
  return NextResponse.json(promo, { status: 201 });
}
