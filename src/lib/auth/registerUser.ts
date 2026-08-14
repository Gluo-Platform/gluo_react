'use server';

import { backendToken, baseUrl, hCaptchaSecretKey } from '../common/constants';
import { registerSchema } from '../common/schemas/register';

export async function registerUser(fields: unknown) {
  const parsed = registerSchema.safeParse(fields);
  if (!parsed.success) {
    return {
      success: false,
      message: "We couldn't process your request. Please try again.",
    };
  }

  const { confirm_email, captchaToken, username, email, password, referral } =
    parsed.data;

  if (confirm_email !== '') {
    return {
      success: false,
      message: "We couldn't process your request. Please try again.",
    };
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
    return {
      success: false,
      message: 'Captcha verification failed. Please try again.',
    };
  }

  const apiRes = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${backendToken}`,
    },
    body: JSON.stringify({ username, email, password, referral }),
  });

  if (!apiRes.ok) {
    const err = await apiRes.json().catch(() => null);
    console.log(err);
    return { success: false, message: err?.message ?? 'Registration failed.' };
  }

  return { success: true };
}
