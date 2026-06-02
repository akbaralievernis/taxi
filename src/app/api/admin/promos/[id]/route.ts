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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const promos = await getPromos();
  const idx = promos.findIndex(p => p.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  promos[idx] = { ...promos[idx], ...body };
  await writePromos(promos);
  return NextResponse.json(promos[idx]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const promos = await getPromos();
  const filtered = promos.filter(p => p.id !== id);
  if (filtered.length === promos.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  await writePromos(filtered);
  return NextResponse.json({ success: true });
}
