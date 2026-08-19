import 'server-only';
import z from 'zod';
import { ApiValidationErrorSchema } from '../schemas/apiFetch';
import { ApiResult, ApiResultKind } from '../types/apiFetch';

export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
  config?: {
    dataSchema?: z.ZodType<T>;
  },
): Promise<ApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (e) {
    console.error(e);
    return {
      ok: false,
      type: ApiResultKind.ServerError,
      message: 'Could not reach the server',
    };
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch (e) {
    console.error(e);
    return {
      ok: false,
      type: ApiResultKind.ServerError,
      message: 'Internal server error',
    };
  }

  if (res.status >= 500) {
    console.error({ status: res.status, json });
    return {
      ok: false,
      type: ApiResultKind.ServerError,
      message: 'Internal server error',
    };
  }

  if (!res.ok) {
    const parsed = ApiValidationErrorSchema.safeParse(json);
    if (parsed.success) {
      return {
        ok: false,
        type: ApiResultKind.ApiError,
        status: res.status,
        error: parsed.data,
      };
    }
    return {
      ok: false,
      type: ApiResultKind.ServerError,
      message: 'Internal server error',
    };
  }

  if (config?.dataSchema) {
    const parsed = config.dataSchema.safeParse(json);
    if (!parsed.success) {
      console.error(parsed.error);
      return {
        ok: false,
        type: ApiResultKind.ServerError,
        message: 'Internal server error',
      };
    }
    return { ok: true, data: parsed.data };
  }

  return { ok: true, data: json as T };
}
