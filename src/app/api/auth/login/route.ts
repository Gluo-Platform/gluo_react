import { loginWithGluo } from '@/lib/auth/login';
import { NextResponse } from 'next/server';

type LoginBody = {
  identifier?: unknown;
  password?: unknown;
  remember?: unknown;
};

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json(
      { message: 'Invalid request body.' },
      { status: 400 },
    );
  }

  const identifier =
    typeof body.identifier === 'string' ? body.identifier.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const remember = body.remember === true;

  if (!identifier || !password) {
    return NextResponse.json(
      { message: 'Username and password are required.' },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { message: 'Password must be at least 8 characters.' },
      { status: 400 },
    );
  }

  const result = await loginWithGluo(identifier, password, remember);
  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set('access_token', result.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    ...(remember ? { maxAge: 60 * 60 * 24 * 365 } : {}),
  });

  return response;
}
