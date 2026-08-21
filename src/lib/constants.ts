import 'server-only';

import { getEnvVariable } from './getEnvVariable';

export const nodeEnv = process.env.NODE_ENV ?? 'production';
export const apiBaseUrl = getEnvVariable('API_BASE_URL');
export const cdnBaseUrl = getEnvVariable('NEXT_PUBLIC_CDN_BASE_URL');
export const backendToken = getEnvVariable('BACKEND_TOKEN');
export const hCaptchaSecretKey = getEnvVariable('HCAPTCHA_SECRET_KEY');
