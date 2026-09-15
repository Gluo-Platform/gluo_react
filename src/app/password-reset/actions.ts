'use server';

import { apiFetch } from '@/lib/apiFetch';
import { apiBaseUrl } from '@/lib/constants';
import { actionClient } from '@/lib/safe-action';
import { emailSchema } from '@/lib/schemas/email';
import { passwordResetInputSchema } from './schemas';

export const requestPasswordResetAction = actionClient
  .inputSchema(emailSchema)
  .action(async ({ parsedInput: { email } }) => {
    await apiFetch<{ message: string }>(`${apiBaseUrl}/auth/password/reset`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  });

export const passwordResetAction = actionClient
  .inputSchema(passwordResetInputSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    await apiFetch<{ message: string }>(`${apiBaseUrl}/auth/password/reset`, {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  });
