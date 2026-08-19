import { ApiValidationError } from '../schemas/apiFetch';

export const ApiResultKind = {
  ApiError: 'api_error',
  ServerError: 'server_error',
} as const;

export type ApiResultKind = (typeof ApiResultKind)[keyof typeof ApiResultKind];

export type ApiResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      type: typeof ApiResultKind.ApiError;
      status: number;
      error: ApiValidationError;
    }
  | {
      ok: false;
      type: typeof ApiResultKind.ServerError;
      message: string;
    };
