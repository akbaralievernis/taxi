import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getAuditEntries } from '@/lib/audit-log';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const limit = Math.min(Math.max(Number(req.nextUrl.searchParams.get('limit')) || 100, 1), 500);
  const actor = req.nextUrl.searchParams.get('actor') ?? undefined;
  const action = req.nextUrl.searchParams.get('action') ?? undefined;

  const entries = await getAuditEntries({ limit, actor, action });
  return NextResponse.json(entries);
}
