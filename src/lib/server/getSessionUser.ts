import 'server-only';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { apiFetch } from '../apiFetch';
import { apiBaseUrl } from '../constants';

// might move it under lib/types
export type User = {
  id: string;
  username: string;
  avatar: string | null;
  permissions: number;
  status: string;
  banner: {
    type: string;
    value: string;
  };
  about: string;
  private: boolean;
  creation_timestamp: number;
  streak: number;
  email_address: string;
  invisible: boolean;
  feeds: { id: string; name: string; type: string; icon: string }[];
};

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
