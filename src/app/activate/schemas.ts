import z from 'zod';

export const requestActivationSchema = z.object({
  email: z.email(),
});

export type RequestActivationSchemaType = z.infer<
  typeof requestActivationSchema
>;
