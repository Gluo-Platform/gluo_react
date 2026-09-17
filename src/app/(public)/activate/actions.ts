'use server';

import { apiFetch } from '@/lib/apiFetch';
import { apiBaseUrl, backendToken } from '@/lib/constants';
import { actionClient } from '@/lib/safe-action';
import { emailSchema } from '@/lib/schemas/email';
import { returnValidationErrors } from 'next-safe-action';

export const requestActivationAction = actionClient
  .inputSchema(emailSchema)
  .action(async ({ parsedInput: { email } }) => {
    const result = await apiFetch<{ message: string }>(
      `${apiBaseUrl}/auth/email/resend`,
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
