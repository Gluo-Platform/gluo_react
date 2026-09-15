'use server';

import { apiFetch } from '@/lib/apiFetch';
import { apiBaseUrl } from '@/lib/constants';
import { actionClient } from '@/lib/safe-action';
import { emailSchema } from '@/lib/schemas/email';
import { redirect } from 'next/navigation';

export async function requestActivationFormAction(formData: FormData) {
  const email = formData.get('email') as string;
  console.log(email);
  await requestActivationAction({ email });
  redirect(`/check-inbox?email=${email}`);
}

export const requestActivationAction = actionClient
  .inputSchema(emailSchema)
  .action(async ({ parsedInput: { email } }) => {
    await apiFetch<{ message: string }>(`${apiBaseUrl}/auth/email/resend`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  });
