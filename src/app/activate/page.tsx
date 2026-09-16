import EmailForm from '@/components/forms/EmailForm';
import Link from 'next/link';
import { requestActivationAction } from './actions';

export default async function ActivationRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ expired?: boolean }>;
}) {
  const { expired } = await searchParams;
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
          {expired ? 'This link has expired' : 'Request a new activation email'}
        </h1>

        <p className="mt-2 text-sm text-secondary-font">
          Activation links are only valid for an hour. Enter your email below
          and we&apos;ll send a new one.
        </p>

        <div className="mt-8">
          <EmailForm type="activate" action={requestActivationAction} />
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
