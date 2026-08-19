'use server';

import { cookies } from 'next/headers';
import { apiBaseUrl, nodeEnv } from '../common/constants';
import { LoginSchemaType } from '../common/schemas/login';
import { apiFetch } from '../common/utils/apiFetch';

export async function logUserIn({
  identifier,
  password,
  remember,
}: LoginSchemaType) {
  const result = await apiFetch<{ token: string }>(`${apiBaseUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identifier, password }),
  });

  if (result.ok) {
    const cookieStore = await cookies();
    cookieStore.set('session', result.data.token, {
      httpOnly: true,
      secure: nodeEnv === 'production',
      sameSite: 'lax',
      path: '/',
      ...(remember && {
        maxAge: 60 * 60 * 24 * 365, // 365 days
      }),
    });

    return { ok: true } as const;
  }

  return result;
}
