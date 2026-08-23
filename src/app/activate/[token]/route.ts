import { apiFetch } from '@/lib/apiFetch';
import { apiBaseUrl, backendToken } from '@/lib/constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  console.log({ token });

  const result = await apiFetch<{ token: string }>(
    `${apiBaseUrl}/auth/activate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${backendToken}`,
      },
      body: JSON.stringify({ token }),
    },
  );
  console.log(result);

  if (result.ok) {
    const cookieStore = await cookies();
    cookieStore.set('session', result.data.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    redirect('/feed');
  }

  redirect('/activate?expired=true');
}
