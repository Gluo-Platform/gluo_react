import z from 'zod';

export const DEFAULT_TOPICS = [
  'Art',
  'Drawing',
  'Photography', // Art
  'Gluo',
  'Shitposting',
  'Memes',
  'Travel',
  'History',
  'Quote',
  'Tolkien', // Other
  'Programming',
  'Webdevelopment',
  'Math', // Technology
  'Gaming',
  'Minecraft', // Gaming
  'Languages',
  'German',
  'Dutch',
  'Duolingo', // Languages
  'Food',
  'Nature', // Food
  'Animals',
  'Cats',
  'Horses', // Animals
  'Circus',
  'School', // Sport or smth
] as const;

export const onboardingSchema = z.object({
  topics: z.array(z.enum(DEFAULT_TOPICS)).min(1).max(5),
});

export type OnboardingSchemaType = z.infer<typeof onboardingSchema>;
