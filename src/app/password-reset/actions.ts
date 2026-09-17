'use server';

import { apiFetch } from '@/lib/apiFetch';
import { apiBaseUrl, backendToken, nodeEnv } from '@/lib/constants';
import { actionClient } from '@/lib/safe-action';
import { emailSchema } from '@/lib/schemas/email';
import { returnValidationErrors } from 'next-safe-action';
import { cookies } from 'next/headers';
import { passwordResetInputSchema } from './schemas';

export const requestPasswordResetAction = actionClient
  .inputSchema(emailSchema)
  .action(async ({ parsedInput: { email } }) => {
    const result = await apiFetch<{ message: string }>(
      `${apiBaseUrl}/auth/password/reset`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${backendToken}`,
        },
        body: JSON.stringify({ email }),
      },
    );

    if (!result.ok) {
      const shaped: Record<string, { _errors: string[] }> = {};
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        shaped[field] = { _errors: [message] };
      }
      returnValidationErrors(emailSchema, {
        ...shaped,
        ...(result.generalError && { _errors: [result.generalError] }),
      });
    }

    return true;
  });

export const passwordResetAction = actionClient
  .inputSchema(passwordResetInputSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    const result = await apiFetch<{ token: string }>(
      `${apiBaseUrl}/auth/password/change`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${backendToken}`,
        },
        body: JSON.stringify({ token, password }),
      },
    );

    if (!result.ok) {
      const shaped: Record<string, { _errors: string[] }> = {};
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        shaped[field] = { _errors: [message] };
      }
      returnValidationErrors(passwordResetInputSchema, {
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
      maxAge: 60 * 60 * 24 * 5, // 5 days
    });

    return true;
  });
