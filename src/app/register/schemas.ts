import z from 'zod';

export const registerInputSchema = z.object({
  username: z
    .string()
    .trim()
    .nonempty('"username" can\'t be left empty.')
    .max(30, "username can't exceed 30 characters."),
  email: z
    .email()
    .nonempty('"email" can\'t be left empty.')
    .max(128, "email can't exceed 128 characters"),
  // THIS IS A HONEYPOT
  confirmEmail: z.literal(''),
  password: z
    .string()
    .nonempty('"password" can\'t be left empty.')
    .min(8, "password can't be shorter than 8 characters.")
    .max(128, "password can't exceed 128 characters."),
  referral: z.string().length(10, 'Invalid referral code').optional(),
  captchaToken: z.string().nonempty('Please complete the captcha.'),
});

export const registerOutputSchema = z.object({
  message: z.string(),
});

export type RegisterInputSchemaType = z.infer<typeof registerInputSchema>;
export type RegisterOutputSchemaType = z.infer<typeof registerOutputSchema>;
