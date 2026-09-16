import 'server-only';
import z from 'zod';
import { ActionError } from '@/lib/safe-action';
import { inspect } from 'node:util';

const DetailItemSchema = z.object({
  field: z.string().optional(),
  error: z.string(),
});

const ApiValidationErrorSchema = z.object({
  error: z.string(),
  details: z.array(DetailItemSchema),
});

type DetailItem = z.infer<typeof DetailItemSchema>;
type ApiValidationError = z.infer<typeof ApiValidationErrorSchema>;

type GeneralError = string | null;
type FieldErrors = Record<string, string>;

type ParsedErrors = {
  generalError: GeneralError;
  fieldErrors: FieldErrors;
};

function parseApiError(details: DetailItem[]): ParsedErrors {
  console.log({ details });
  return details.reduce<ParsedErrors>(
    (acc, d) => {
      if (d.field) {
        acc.fieldErrors[d.field] = d.error ?? '';
      } else {
        acc.generalError = d.error;
      }
      return acc;
    },
    { fieldErrors: {}, generalError: null },
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
  } catch (error) {
    console.error(inspect({ error }, { depth: null }));
    throw new ActionError('Could not reach the server');
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch (error) {
    console.error(inspect({ error }, { depth: null }));
    throw new ActionError('Internal server error');
  }

  if (res.status >= 500) {
    console.error(inspect({ status: res.status, json }, { depth: null }));
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

    console.log(inspect({ json }, { depth: null }));
    throw new ActionError('Internal server error');
  }

  return { ok: true, data: json as T };
}
