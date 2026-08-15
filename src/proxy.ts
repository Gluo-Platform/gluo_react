import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  const session = request.cookies.get('session');

  if (!session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // note to self: match against what demands user
  matcher: ['/feed/:path*', '/me/:path*', '/social/:path*'],
};
