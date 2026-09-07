'use client';
import { registerUserAction } from '@/app/register/actions';
import {
  registerInputSchema,
  RegisterInputSchemaType,
} from '@/app/register/schemas';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const fieldClassName =
  'w-full rounded-xl bg-secondary-bg py-3.5 pr-4 pl-11 text-base text-foreground outline-none placeholder:text-secondary-font transition-colors duration-300 focus:bg-tertiary-bg';

export default function RegisterForm() {
  const captchaRef = useRef<HCaptcha>(null);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInputSchemaType>({
    resolver: zodResolver(registerInputSchema),
    defaultValues: {
      username: '',
      email: '',
      confirmEmail: '',
      password: '',
      referral: searchParams.get('ref') ?? undefined,
      captchaToken: '',
    },
  });

  async function onSubmit(values: RegisterInputSchemaType) {
    try {
      // server action does the redirection
      const result = await registerUserAction(values);

      if (result.serverError) {
        setError('root', {
          message: result.serverError,
        });
      } else if (result.validationErrors) {
        const { _errors: rootErrors, ...fieldErrors } = result.validationErrors;

        if (rootErrors?.[0]) {
          setError('root', { message: rootErrors[0] });
        }

        for (const key of Object.keys(
          fieldErrors,
        ) as (keyof typeof fieldErrors)[]) {
          const message = fieldErrors[key]?._errors?.[0];
          if (message) {
            setError(key, { message });
          }
        }
      }
    } catch (error) {
      console.log(error);
      setError('root', { message: 'Internal server error' });
    } finally {
      captchaRef.current?.resetCaptcha();
    }
  }

  return (
    <div className="animate-fade-up w-full max-w-105">
      <div className="rounded-2xl bg-background p-8 sm:p-10">
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <div className="relative">
              <label className="sr-only" htmlFor="username">
                Username
              </label>
              <i
                className="fas fa-user pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-secondary-font"
                aria-hidden="true"
              />
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Username"
                maxLength={128}
                className={fieldClassName}
                {...register('username')}
              />
            </div>
            {errors.username && (
              <p className="mt-1.5 text-xs text-red">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <i
                className="fas fa-at pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-secondary-font"
                aria-hidden="true"
              />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                maxLength={128}
                className={fieldClassName}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red">{errors.email.message}</p>
            )}
          </div>

          {/* honeypot kept hidden off-screen, never shown to real users */}
          <div
            style={{ position: 'absolute', left: '-9999px' }}
            aria-hidden="true"
          >
            <label htmlFor="confirmEmail">Confirm Email</label>
            <input
              id="confirmEmail"
              tabIndex={-1}
              autoComplete="off"
              {...register('confirmEmail')}
            />
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
                autoComplete="new-password"
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

          <div>
            <div className="flex justify-center">
              <HCaptcha
                ref={captchaRef}
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                onVerify={(token) =>
                  setValue('captchaToken', token, { shouldValidate: true })
                }
                onExpire={() =>
                  setValue('captchaToken', '', { shouldValidate: true })
                }
                onError={() =>
                  setValue('captchaToken', '', { shouldValidate: true })
                }
              />
            </div>
            {errors.captchaToken && (
              <p role="alert">{errors.captchaToken.message}</p>
            )}

            {errors.root && <p role="alert">{errors.root.message}</p>}
          </div>

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
                Creating account
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
        Already have an account?{' '}
        <Link
          href="/"
          className="font-medium text-foreground transition-colors duration-300 hover:text-primary"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
