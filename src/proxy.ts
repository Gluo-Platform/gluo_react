import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('access_token');
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/' || pathname === '/register';
  const isProtectedRoute =
    pathname.startsWith('/feed') ||
    pathname.startsWith('/me') ||
    pathname.startsWith('/social') ||
    pathname.startsWith('/user');

  if (accessToken) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL('/feed/following', request.url));
    }

    return NextResponse.next();
  }

  if (isProtectedRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/register',
    '/feed/:path*',
    '/me/:path*',
    '/social/:path*',
    '/user/:path*',
  ],
};
