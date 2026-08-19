import 'server-only';

import { getEnvVariable } from './utils/getEnvVariable';
import { ApiResult, ApiResultKind } from './types/apiFetch';

export const nodeEnv = process.env.NODE_ENV ?? 'production';
export const apiBaseUrl = getEnvVariable('API_BASE_URL');
export const cdnBaseUrl = getEnvVariable('NEXT_PUBLIC_CDN_BASE_URL');
export const backendToken = getEnvVariable('BACKEND_TOKEN');
export const hCaptchaSecretKey = getEnvVariable('HCAPTCHA_SECRET_KEY');

export const GENERIC_ERROR: ApiResult<never> = {
  ok: false,
  type: ApiResultKind.ServerError,
  message: 'Internal server error',
};
