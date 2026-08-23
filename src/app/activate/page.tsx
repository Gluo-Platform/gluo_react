import Link from 'next/link';
import { requestActivationFormAction } from './actions';
import { IslandSubmitBtn } from '@/components/ui/IslandSubmitBtn';

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
          <form className="flex gap-4" action={requestActivationFormAction}>
            <div className="relative flex-1">
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <i
                className="fas fa-user pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-secondary-font"
                aria-hidden="true"
              />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                maxLength={128}
                className="w-full rounded-xl bg-secondary-bg py-3.5 pr-4 pl-11 text-base text-foreground outline-none placeholder:text-secondary-font transition-colors duration-300 focus:bg-tertiary-bg"
              />
            </div>
            <div>
              <IslandSubmitBtn
                staticText={
                  <i
                    className="fas fa-paper-plane text-sm transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                }
                loadingText={
                  <i
                    className="fas fa-circle-notch animate-spin"
                    aria-hidden="true"
                  />
                }
                className="cursor-pointer group mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-semibold text-background transition-[transform,opacity] duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </form>
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
