import { CheckInboxType } from '@/lib/types/emailAction';
import Link from 'next/link';

function maskEmail(email: string) {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  if (local.length <= 2) return `${local[0] ?? ''}*@${domain}`;
  return `${local[0]}${'*'.repeat(local.length - 2)}${local.at(-1)}@${domain}`;
}

// note to self: an array/Set version scales better if we want to support more types
function isValidType(type?: string): type is CheckInboxType {
  return type === 'password' || type === 'activate';
}

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; email?: string }>;
}) {
  const { type, email } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-bg">
          <i
            className="fas fa-envelope text-xl text-primary"
            aria-hidden="true"
          />
        </div>

        <h1 className="text-xl font-semibold text-foreground">
          Check your email
        </h1>

        <p className="mt-2 text-sm text-secondary-font">
          We&apos;ll email you instructions if an account exists for
          {email ? (
            <span className="font-medium text-foreground">
              {maskEmail(email)}.
            </span>
          ) : (
            'that email.'
          )}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <h2>Didn&apos;t receive an email?</h2>
          <p>Please wait a few second, check your spam folder.</p>

          {isValidType(type) && (
            <span>
              Or you can{' '}
              <Link
                href={type === 'activate' ? '/activate' : '/password-reset'}
                className="font-bold"
              >
                Request a new one
              </Link>
            </span>
          )}

          <Link
            href="/"
            className="text-xs text-secondary-font transition-colors duration-300 hover:text-foreground"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
