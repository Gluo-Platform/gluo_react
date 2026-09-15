import { z } from 'zod';

export const emailSchema = z.object({
  email: z
    .email()
    .min(8, "email can't be shorter than 8 characters.")
    .max(128, "email can't exceed 128 characters."),
});

export type EmailSchemaType = z.infer<typeof emailSchema>;
