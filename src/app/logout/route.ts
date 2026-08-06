import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/', request.url));

  response.cookies.delete('access_token');
  // response.cookies.delete('access_token'); // in preparation for 2 token combo

  return response;
}
