import EmailForm from '@/components/forms/EmailForm';
import Link from 'next/link';
import { Suspense } from 'react';
import { requestPasswordResetAction } from './actions';

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: boolean }>;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-bg">
          <i
            className="fas fa-clock-rotate-left text-xl text-secondary-font"
            aria-hidden="true"
          />
        </div>

        <h1 className="text-xl font-semibold text-foreground">
          <Suspense fallback={<div>TODO: title skeleton?</div>}>
            {searchParams.then(({ expired }) =>
              expired
                ? 'This link has expired'
                : 'Request a new password reset email',
            )}
          </Suspense>
        </h1>

        <p className="mt-2 text-sm text-secondary-font">
          Password reset links are only valid for an hour. Enter your email
          below and we&apos;ll send a new one.
        </p>

        <div className="mt-8">
          <EmailForm type="password" action={requestPasswordResetAction} />
        </div>

        <Link
          href="/"
          className="mt-6 inline-block text-xs text-secondary-font transition-colors duration-300 hover:text-foreground"
        >
          Back to login
        </Link>
      </div>
    </div>
  );
}
