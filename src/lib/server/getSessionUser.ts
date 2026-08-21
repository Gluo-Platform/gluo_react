import 'server-only';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { apiFetch } from '../apiFetch';
import { apiBaseUrl } from '../constants';
import { User } from '../types/user';

export const getSessionUser = cache(async (): Promise<User | null> => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;

  if (!sessionToken) return null;

  const result = await apiFetch<User>(`${apiBaseUrl}/user/@me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
    cache: 'no-store',
  });

  if (!result.ok) return null;

  return result.data;
});
