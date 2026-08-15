import { API_BASE_URL } from '@/lib/api/config';
import { NextResponse } from 'next/server';

function isAllowedAvatar(src: string) {
  try {
    const url = new URL(src);
    const allowed = new URL(API_BASE_URL);
    const path = url.pathname;
    return (
      url.hostname === allowed.hostname &&
      (path.startsWith('/media/avatars/') || path.startsWith('/avatars/'))
    );
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const src = new URL(request.url).searchParams.get('src');
  if (!src || !isAllowedAvatar(src)) {
    return NextResponse.json({ message: 'Invalid avatar.' }, { status: 400 });
  }

  try {
    const upstream = await fetch(src);
    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ message: 'Avatar not found.' }, { status: 404 });
    }

    return new NextResponse(upstream.body, {
      headers: {
        'Content-Type':
          upstream.headers.get('Content-Type') ?? 'image/webp',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch {
    return NextResponse.json({ message: 'Avatar unavailable.' }, { status: 502 });
  }
}
