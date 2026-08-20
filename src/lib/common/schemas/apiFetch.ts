import z from 'zod';

export const FieldErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.number(),
});

export const GeneralErrorSchema = z
  .object({
    message: z.string(),
    code: z.number(),
  })
  .strict();

export const DetailItemSchema = z.union([FieldErrorSchema, GeneralErrorSchema]);

export const ApiValidationErrorSchema = z.object({
  error: z.string(),
  details: z.array(DetailItemSchema),
});

export type FieldError = z.infer<typeof FieldErrorSchema>;
export type GeneralError = z.infer<typeof GeneralErrorSchema>;
export type DetailItem = z.infer<typeof DetailItemSchema>;
export type ApiValidationError = z.infer<typeof ApiValidationErrorSchema>;

export function isFieldError(d: DetailItem): d is FieldError {
  return 'field' in d;
}
