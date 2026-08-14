import 'server-only';

import { getEnvVariable } from './utils/getEnvVariable';

export const baseUrl = getEnvVariable('API_BASE_URL');
export const backendToken = getEnvVariable('BACKEND_TOKEN');
export const hCaptchaSecretKey = getEnvVariable('HCAPTCHA_SECRET_KEY');
