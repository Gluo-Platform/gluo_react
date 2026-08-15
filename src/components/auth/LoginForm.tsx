'use client';

import {
  extractAvatarPalette,
  type AvatarPalette,
} from '@/lib/auth/avatarPalette';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CSSProperties,
  FormEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

const DEFAULT_AVATAR = 'https://api.gluo.xyz/avatars/default.png';

type LookupResponse = {
  found?: boolean;
  avatar?: string;
  username?: string;
};

const fieldClassName =
  'w-full rounded-xl bg-secondary-bg py-3.5 pr-4 pl-11 text-base text-foreground outline-none placeholder:text-secondary-font transition-colors duration-300 focus:bg-tertiary-bg';

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [palette, setPalette] = useState<AvatarPalette | null>(null);
  const [wash, setWash] = useState<AvatarPalette | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [titleHeight, setTitleHeight] = useState<number>();

  useEffect(() => {
    const value = identifier.trim();
    if (!value || value.includes('@')) {
      setAvatar(DEFAULT_AVATAR);
      setResolvedName(null);
      setPalette(null);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/auth/lookup?username=${encodeURIComponent(value)}`,
          { signal: controller.signal },
        );
        const data = (await response.json()) as LookupResponse;

        if (data.found && data.avatar) {
          setAvatar(data.avatar);
          setResolvedName(data.username ?? value);
          return;
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }

      setAvatar(DEFAULT_AVATAR);
      setResolvedName(null);
      setPalette(null);
    }, 150);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [identifier]);

  useEffect(() => {
    setPalette(null);
    if (!resolvedName || avatar === DEFAULT_AVATAR) {
      return;
    }

    let cancelled = false;
    extractAvatarPalette(avatar).then((colors) => {
      if (!cancelled) {
        setPalette(colors);
        if (colors) {
          setWash(colors);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [avatar, resolvedName]);

  useLayoutEffect(() => {
    const title = titleRef.current;
    if (!title) {
      return;
    }
    setTitleHeight(title.scrollHeight);
  }, [resolvedName]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, remember }),
      });
      const data = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!response.ok) {
        setError(data?.message ?? 'Unable to sign in. Please try again.');
        return;
      }

      router.push('/feed/following');
      router.refresh();
    } catch {
      setError('Unable to reach Gluo. Please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <div
        className={`avatar-wash${palette ? ' visible' : ''}`}
        style={
          wash
            ? ({
                '--wash-1': wash.washOne,
                '--wash-2': wash.washTwo,
                '--wash-3': wash.washThree,
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
            <img
              key={avatar}
              src={avatar}
              alt={resolvedName ? `${resolvedName}'s avatar` : 'Account avatar'}
              width={88}
              height={88}
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
              {resolvedName ? `Welcome back, ${resolvedName}` : 'Welcome back'}
            </h1>
          </div>
          <p className="mt-2 text-sm text-secondary-font">
            Enter your credentials to continue
          </p>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
              name="identifier"
              type="text"
              autoComplete="username"
              placeholder="Username or email"
              required
              maxLength={128}
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              className={fieldClassName}
            />
          </div>

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
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Password"
              required
              minLength={8}
              maxLength={128}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`${fieldClassName} pr-12`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-4 text-secondary-font transition-colors duration-300 hover:text-primary"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <i
                className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                aria-hidden="true"
              />
            </button>
          </div>

          <label className="flex cursor-pointer items-center gap-3 pt-1 text-sm text-secondary-font select-none">
            <span className="relative flex size-4.5 items-center justify-center">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="peer sr-only"
              />
              <span className="size-4.5 rounded-md bg-tertiary-bg transition-colors duration-300 peer-checked:bg-primary" />
              <i
                className={`fas fa-check pointer-events-none absolute text-[9px] text-background transition-opacity duration-200 ${
                  remember ? 'opacity-100' : 'opacity-0'
                }`}
                aria-hidden="true"
              />
            </span>
            Remember me
          </label>

          {error ? (
            <p
              className="rounded-xl bg-red/10 px-3 py-2.5 text-sm text-red"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="group mt-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-semibold text-background transition-[transform,opacity] duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? (
              <>
                <i className="fas fa-circle-notch animate-spin" aria-hidden="true" />
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
