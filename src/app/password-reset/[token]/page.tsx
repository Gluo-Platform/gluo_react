import ResetPasswordForm from '@/components/forms/ResetPasswordForm';
import Link from 'next/link';

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-bg">
          <i
            className="fas fa-lock text-xl text-secondary-font"
            aria-hidden="true"
          />
        </div>

        <h1 className="text-xl font-semibold text-foreground">
          Reset your password
        </h1>

        <div className="mt-8">
          <ResetPasswordForm token={token} />
        </div>

        <span className="mt-6 inline-block text-xs text-secondary-font">
          Never mind!{' '}
          <Link
            href="/"
            className="underline transition-colors duration-300 hover:text-foreground"
          >
            Back to login
          </Link>
        </span>
      </div>
    </div>
  );
}
