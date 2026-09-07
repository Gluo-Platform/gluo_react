import z from 'zod';

export const loginInputSchema = z.object({
  identifier: z
    .string()
    .trim()
    .nonempty('Missing "identifier" field!')
    .max(128, '"identifier" is too long!'),
  password: z
    .string()
    .nonempty('Missing "password" field!')
    .min(8, '"password" can\'t be shorter than 8 characters.')
    .max(128, '"password" is too long!'),
  remember: z.boolean().optional().default(false),
});

export type LoginInputSchemaType = z.infer<typeof loginInputSchema>;
