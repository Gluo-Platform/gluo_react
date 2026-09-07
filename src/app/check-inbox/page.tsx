import Link from 'next/link';

function maskEmail(email: string) {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  if (local.length <= 2) return `${local[0] ?? ''}*@${domain}`;
  return `${local[0]}${'*'.repeat(local.length - 2)}${local.at(-1)}@${domain}`;
}

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

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
          {email ? (
            <>
              We sent a verification link to{' '}
              <span className="font-medium text-foreground">
                {maskEmail(email)}
              </span>
              .
            </>
          ) : (
            'We sent a verification link to your inbox.'
          )}{' '}
          Click it to activate your account.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <span>
            Didn&apos;t get activation email?{' '}
            <Link href="/activate?expired=true" className="font-bold">
              Request a new one
            </Link>
          </span>

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
