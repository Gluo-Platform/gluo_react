import 'server-only';
import z from 'zod';
import { ActionError } from '@/lib/safe-action';

const FieldErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.number(),
});

const GeneralErrorSchema = z
  .object({
    message: z.string(),
    code: z.number(),
  })
  .strict();

const DetailItemSchema = z.union([FieldErrorSchema, GeneralErrorSchema]);

const ApiValidationErrorSchema = z.object({
  error: z.string(),
  details: z.array(DetailItemSchema),
});

type DetailItem = z.infer<typeof DetailItemSchema>;
type ApiValidationError = z.infer<typeof ApiValidationErrorSchema>;

type GeneralError = string;
type FieldErrors = Record<string, string>;

type ParsedErrors = {
  generalError: GeneralError;
  fieldErrors: FieldErrors;
};

function parseApiError(details: DetailItem[]): ParsedErrors {
  return details.reduce<ParsedErrors>(
    (acc, d) => {
      if ('field' in d) {
        acc.fieldErrors[d.field] = d.message;
      } else {
        acc.generalError = d.message;
      }
      return acc;
    },
    { fieldErrors: {}, generalError: '' },
  );
}

type FetchResult<T> = Promise<
  | { ok: true; data: T }
  | { ok: false; generalError: GeneralError; fieldErrors: FieldErrors }
>;

export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): FetchResult<T> {
  let res: Response;
  try {
    res = await fetch(url, options);
  } catch (e) {
    console.error(e);
    throw new ActionError('Could not reach the server');
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch (e) {
    console.error(e);
    throw new ActionError('Internal server error');
  }

  if (res.status >= 500) {
    console.error({ status: res.status, json });
    throw new ActionError('Internal server error');
  }

  if (!res.ok) {
    // just incase Kip forgot to migrate to the new error shapes
    const parsed = ApiValidationErrorSchema.safeParse(json);
    if (parsed.success) {
      return {
        ok: false,
        ...parseApiError((json as ApiValidationError).details),
      };
    }

    console.error('unexpected error shape, alert kip');
    throw new ActionError('Internal server error');
  }

  return { ok: true, data: json as T };
}
