import { NextRequest, NextResponse } from 'next/server';
import { checkAdminCredentials, createSession, setSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { login, password } = await req.json();
    if (!checkAdminCredentials(login, password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const token = await createSession(login);
    await setSessionCookie(token);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
