'use server';

import { apiBaseUrl } from '../common/constants';
import { apiFetch } from '../common/utils/apiFetch';

type LookupResultType = { username: string; avatar: string | null } | null;

export async function lookupUser(username: string): Promise<LookupResultType> {
  const result = await apiFetch<LookupResultType>(
    `${apiBaseUrl}/user/${username}?username=true`,
  );
  if (!result.ok) return null;

  return result.data;
}
