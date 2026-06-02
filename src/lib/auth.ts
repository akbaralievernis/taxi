import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-secret-for-dev-only-please-change'
);

const COOKIE_NAME = 'admin_session';

export async function createSession(username: string): Promise<string> {
  const token = await new SignJWT({ username, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
  return token;
}

export async function verifySession(token: string | undefined): Promise<{ username: string } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { username: payload.username as string };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<{ username: string } | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return verifySession(token);
}

export function checkAdminCredentials(login: string, password: string): boolean {
  const adminLogin = process.env.ADMIN_LOGIN ?? 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';
  return login === adminLogin && password === adminPassword;
}

export async function getDriverSession(): Promise<{ driverId: string } | null> {
  const store = await cookies();
  const token = store.get('driver_session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return { driverId: payload.driverId as string };
  } catch {
    return null;
  }
}
