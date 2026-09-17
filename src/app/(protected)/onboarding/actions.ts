'use server';

import { actionClient } from '@/lib/safe-action';
import { onboardingSchema } from './schemas';
import { returnValidationErrors } from 'next-safe-action';
import { apiFetch } from '@/lib/apiFetch';
import { apiBaseUrl, backendToken } from '@/lib/constants';

export const onboardUserAction = actionClient
  .inputSchema(onboardingSchema)
  .action(async ({ parsedInput: { topics } }) => {
    const result = await apiFetch<{
      id: string;
      name: string;
      icon: string;
      type: string;
    }>(`${apiBaseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${backendToken}`,
      },
      body: JSON.stringify({
        name: 'For you',
        icon: 'fa-home',
        topics,
        prefer_media: true,
        anyone: true,
      }),
    });

    if (!result.ok) {
      const shaped: Record<string, { _errors: string[] }> = {};
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        shaped[field] = { _errors: [message] };
      }
      returnValidationErrors(onboardingSchema, {
        ...shaped,
        ...(result.generalError && { _errors: [result.generalError] }),
      });
    }

    return result.data;
  });
