import z from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .nonempty('"username" can\'t be left empty.')
    .max(30, "username can't exceed 30 characters."),
  email: z.email().nonempty('"email" can\'t be left empty.'),
  // THIS IS A HONEYPOT
  confirm_email: z.literal(''),
  password: z
    .string()
    .nonempty('"password" can\'t be left empty.')
    .min(8, "password can't be shorter than 8 characters.")
    .max(128, "password can't exceed 128 characters."),
  referral: z.string().length(10, 'Invalid referral code'),
  captchaToken: z.string().nonempty('Please complete the captcha.'),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
