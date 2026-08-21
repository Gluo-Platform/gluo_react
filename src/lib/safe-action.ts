import { createSafeActionClient } from 'next-safe-action';
import { cookies } from 'next/headers';

export class ActionError extends Error {}

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof ActionError) {
      return e.message;
    }
    console.error('Unhandled server error:', e);
    return 'Internal server error.';
  },
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const token = (await cookies()).get('session')?.value;

  if (!token) {
    throw new ActionError('You must be logged in.');
  }

  return next({ ctx: { token } });
});
