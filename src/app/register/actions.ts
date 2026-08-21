'use server';

import { actionClient } from '@/lib/safe-action';
import {
  registerInputSchema,
  registerOutputSchema,
  RegisterOutputSchemaType,
} from './schemas';
import { returnValidationErrors } from 'next-safe-action';
import { apiFetch } from '@/lib/apiFetch';
import { apiBaseUrl, backendToken, hCaptchaSecretKey } from '@/lib/constants';

export const registerUser = actionClient
  .inputSchema(registerInputSchema)
  .outputSchema(registerOutputSchema)
  .action(
    async ({
      parsedInput: {
        username,
        email,
        confirmEmail,
        password,
        referral,
        captchaToken,
      },
    }) => {
      if (confirmEmail !== '') {
        returnValidationErrors(registerInputSchema, {
          // generic error, not confirm_email, can't expose it's existence
          _errors: ['Something went wrong.'],
        });
      }

      const captchaRes = await fetch('https://api.hcaptcha.com/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: hCaptchaSecretKey,
          response: captchaToken,
        }),
      });
      const captchaData = await captchaRes.json();
      if (!captchaData.success) {
        returnValidationErrors(registerInputSchema, {
          captchaToken: { _errors: ['Verification failed. Please try again.'] },
        });
      }

      const result = await apiFetch<RegisterOutputSchemaType>(
        `${apiBaseUrl}/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${backendToken}`,
          },
          body: JSON.stringify({ username, email, password, referral }),
        },
      );

      if (!result.ok) {
        const shaped: Record<string, { _errors: string[] }> = {};
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          shaped[field] = { _errors: [message] };
        }
        returnValidationErrors(registerInputSchema, {
          ...shaped,
          ...(result.generalError && { _errors: [result.generalError] }),
        });
      }

      return result.data;
    },
  );
