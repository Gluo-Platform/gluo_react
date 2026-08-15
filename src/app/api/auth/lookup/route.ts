import { API_BASE_URL } from '@/lib/api/config';
import { NextResponse } from 'next/server';

type UserLookup = {
  avatar?: string;
  username?: string;
};

export async function GET(request: Request) {
  const username = new URL(request.url).searchParams.get('username')?.trim();

  if (!username || username.includes('@') || username.length > 30) {
    return NextResponse.json({ found: false });
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/user/${encodeURIComponent(username)}?username=true`,
      { headers: { Accept: 'application/json' } },
    );

    if (!response.ok) {
      return NextResponse.json({ found: false });
    }

    const user = (await response.json()) as UserLookup;
    if (!user.avatar) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({
      found: true,
      username: user.username ?? username,
      avatar: `${API_BASE_URL}/media/avatars/${user.avatar}`,
    });
  } catch {
    return NextResponse.json({ found: false }, { status: 502 });
  }
}
