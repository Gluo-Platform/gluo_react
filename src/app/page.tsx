import LoginForm from '@/components/forms/LoginForm';
import Image from 'next/image';
import logo from '../../public/mediapack/logo_transparent.png';

export default function LoginPage() {
  // TODO: currently login form only refreshes.
  // login page needs to check the validity of the cookie,
  // if one is found and valid, redirect to /feed
  // if not we let the user re login and overwrite
  // the stale cookie
  return (
    <div className="flex h-full overflow-hidden bg-background">
      <section className="hidden w-1/2 flex-col justify-between p-12 lg:flex xl:p-16">
        <div className="flex items-center gap-3">
          <Image
            src={logo}
            alt="Gluo"
            width={40}
            height={40}
            className="size-10"
          />
          <span className="text-xl font-medium tracking-tight">Gluo</span>
        </div>

        <div className="max-w-md">
          <p className="mb-4 text-sm font-medium tracking-[0.2em] text-secondary-font uppercase">
            Social, rebuilt
          </p>
          <h2 className="text-5xl leading-tight font-medium tracking-tight text-balance">
            A quieter internet starts here.
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-secondary-font">
            Sign in to your feeds, friends, and the people you actually want to
            hear from.
          </p>
        </div>

        <p className="text-sm text-secondary-font">Privacy first. Always.</p>
      </section>

      <section className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="mb-10 flex items-center gap-3 lg:hidden">
          <Image
            src={logo}
            alt="Gluo"
            width={36}
            height={36}
            className="size-9"
          />
          <span className="text-lg font-medium tracking-tight">Gluo</span>
        </div>
        <LoginForm />
      </section>
    </div>
  );
}
