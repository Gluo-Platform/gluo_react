import z from 'zod';

export const passwordResetSchema = z.object({
  password: z
    .string()
    .min(8, "password can't be shorter than 8 characters.")
    .max(128, "password can't exceed 128 characters."),
  confirm_password: z.string(),
});

export const passwordResetInputSchema = z
  .object({
    // extracted from url, not an actual field
    token: z.string(),
    ...passwordResetSchema.shape,
  })
  .refine((data) => data.password === data.confirm_password, {
    error: "Passwords don't match",
    path: ['confirm_password'],
  });

export type PasswordResetSchemaType = z.infer<typeof passwordResetSchema>;
export type PasswordResetInputSchemaType = z.infer<
  typeof passwordResetInputSchema
>;
