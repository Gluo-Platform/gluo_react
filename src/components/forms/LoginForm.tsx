'use client';

import { extractAvatarPalette } from '@/lib/auth/avatarPalette';
import { logUserIn } from '@/lib/auth/logUserIn';
import { lookupUser } from '@/lib/auth/lookupUser';
import { isFieldError } from '@/lib/common/schemas/apiFetch';
import { loginSchema, LoginSchemaType } from '@/lib/common/schemas/login';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CSSProperties, useLayoutEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDebounce } from 'use-debounce';

const fieldClassName =
  'w-full rounded-xl bg-secondary-bg py-3.5 pr-4 pl-11 text-base text-foreground outline-none placeholder:text-secondary-font transition-colors duration-300 focus:bg-tertiary-bg';

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      remember: true,
    },
  });

  const router = useRouter();
  const identifierRaw = useWatch({ control, name: 'identifier' });
  const [identifier] = useDebounce(identifierRaw, 200);
  const {
    data: { username, avatar, palette },
  } = useQuery({
    queryKey: ['identifierLookup', identifier],
    queryFn: async () => {
      const user = await lookupUser(identifier);
      if (user && user.avatar !== null) {
        const palette = await extractAvatarPalette(user.avatar);

        return {
          username: user.username,
          avatar: `${process.env.NEXT_PUBLIC_CDN_BASE_URL}/${user.avatar}`,
          palette,
        };
      }

      return {
        username: null,
        avatar: '/default.webp',
        palette: null,
      };
    },
    enabled: identifier?.trim().length > 0 && !identifier?.includes('@'),
    initialData: { username: null, avatar: '/default.webp', palette: null },
    initialDataUpdatedAt: 0,
  });

  // worth moving into <PasswordField />/<Input variant='password' />
  // we either build our own component library or import one
  const [showPassword, setShowPassword] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleHeight, setTitleHeight] = useState<number>();

  useLayoutEffect(() => {
    const title = titleRef.current;
    if (!title) {
      return;
    }
    setTitleHeight(title.scrollHeight);
  }, [username]);

  async function onSubmit(values: LoginSchemaType) {
    try {
      const result = await logUserIn(values);
      // note to self: no need for router.push()/replace():
      // refresh() rerenders login page (server component)
      // which does server side redirct if it find a valid cookie
      // an animation/transition can be played while the
      // server action resolves as well
      if (result.ok) router.refresh();
      else if (result.type === 'server_error') {
        setError('root', {
          message: result.message,
        });
      } else {
        result.error.details.forEach((detail) => {
          if (isFieldError(detail)) {
            // not proud of this one but it aint worth it
            setError(detail.field as 'identifier', { message: detail.message });
          } else {
            setError('root', { message: detail.message });
          }
        });
      }
    } catch (err) {
      setError('root', {
        message:
          err instanceof Error
            ? err.message
            : 'Unable to sign in. Please check your internet connection.',
      });
    }
  }

  return (
    <>
      <div
        className={`avatar-wash${palette ? ' visible' : ''}`}
        style={
          palette
            ? ({
                '--wash-1': palette.washOne,
                '--wash-2': palette.washTwo,
                '--wash-3': palette.washThree,
              } as CSSProperties)
            : undefined
        }
        aria-hidden="true"
      >
        <div className="avatar-wash-blob one" />
        <div className="avatar-wash-blob two" />
        <div className="avatar-wash-blob three" />
      </div>
      <div className="animate-fade-up w-full max-w-105">
        <div className="rounded-2xl bg-background p-8 sm:p-10">
          <div className="mb-8 text-center">
            <div className="relative mx-auto mb-5 size-22">
              <Image
                key={avatar}
                src={avatar}
                alt={username ? `${username}'s avatar` : 'Account avatar'}
                width={88}
                height={88}
                loading="eager"
                className="size-22 rounded-full object-cover"
              />
            </div>

            <div
              className="overflow-hidden transition-[height] duration-500 ease-out"
              style={{ height: titleHeight }}
            >
              <h1
                ref={titleRef}
                className="text-3xl font-medium tracking-tight"
              >
                {username ? `Welcome back, ${username}` : 'Welcome back'}
              </h1>
            </div>
            <p className="mt-2 text-sm text-secondary-font">
              Enter your credentials to continue
            </p>
          </div>

          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <div className="relative">
                <label className="sr-only" htmlFor="identifier">
                  Username or email
                </label>
                <i
                  className="fas fa-user pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-secondary-font"
                  aria-hidden="true"
                />
                <input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  placeholder="Username or email"
                  maxLength={128}
                  className={fieldClassName}
                  {...register('identifier')}
                />
              </div>
              {errors.identifier && (
                <p className="mt-1.5 text-xs text-red">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <label className="sr-only" htmlFor="password">
                  Password
                </label>
                <i
                  className="fas fa-lock pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-secondary-font"
                  aria-hidden="true"
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Password"
                  maxLength={128}
                  className={`${fieldClassName} pr-12`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="cursor-pointer absolute inset-y-0 right-0 px-4 text-secondary-font transition-colors duration-300 hover:text-primary"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i
                    className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                    aria-hidden="true"
                  />
                </button>
              </div>
              {errors.password ? (
                <p className="mt-1.5 text-xs text-red">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            <label className="flex cursor-pointer items-center gap-3 pt-1 text-sm text-secondary-font select-none">
              <span className="relative flex size-4.5 items-center justify-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  {...register('remember')}
                />
                <span className="size-4.5 rounded-md bg-tertiary-bg transition-colors duration-300 peer-checked:bg-primary" />
                <i
                  className="fas fa-check pointer-events-none absolute text-[9px] text-background opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
                  aria-hidden="true"
                />
              </span>
              Remember me
            </label>

            {errors.root ? (
              <p
                className="rounded-xl bg-red/10 px-3 py-2.5 text-sm text-red"
                role="alert"
              >
                {errors.root.message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer group mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-semibold text-background transition-[transform,opacity] duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <i
                    className="fas fa-circle-notch animate-spin"
                    aria-hidden="true"
                  />
                  Signing in
                </>
              ) : (
                <>
                  Continue
                  <i
                    className="fas fa-arrow-right text-sm transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-secondary-font">
          New to Gluo?{' '}
          <Link
            href="/register"
            className="font-medium text-foreground transition-colors duration-300 hover:text-primary"
          >
            Create an account
          </Link>
        </p>
      </div>
    </>
  );
}
