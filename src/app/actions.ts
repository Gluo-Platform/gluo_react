'use server';

import { actionClient } from '@/lib/safe-action';
import { loginInputSchema } from './schemas';
import { returnValidationErrors } from 'next-safe-action';
import { apiFetch } from '@/lib/apiFetch';
import { apiBaseUrl, backendToken, nodeEnv } from '@/lib/constants';
import { cookies } from 'next/headers';

export const logUserIn = actionClient
  .inputSchema(loginInputSchema)
  .action(async ({ parsedInput: { identifier, password, remember } }) => {
    const result = await apiFetch<{ token: string }>(
      `${apiBaseUrl}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${backendToken}`,
        },
        body: JSON.stringify({ identifier, password }),
      },
    );

    if (!result.ok) {
      const shaped: Record<string, { _errors: string[] }> = {};
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        shaped[field] = { _errors: [message] };
      }
      returnValidationErrors(loginInputSchema, {
        ...shaped,
        ...(result.generalError && { _errors: [result.generalError] }),
      });
    }

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

    return true;
  });
