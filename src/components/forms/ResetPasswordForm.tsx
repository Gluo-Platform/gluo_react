'use client';

import { passwordResetAction } from '@/app/(public)/password-reset/actions';
import {
  passwordResetSchema,
  PasswordResetSchemaType,
} from '@/app/(public)/password-reset/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const fieldClassName =
  'w-full rounded-xl bg-secondary-bg py-3.5 pr-4 pl-11 text-base text-foreground outline-none pr-12 placeholder:text-secondary-font transition-colors duration-300 focus:bg-tertiary-bg';

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: '',
      confirm_password: '',
    },
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [tokenError, setTokenError] = useState<boolean>(false);

  async function onSubmit(values: PasswordResetSchemaType) {
    setTokenError(false);
    try {
      const result = await passwordResetAction({ ...values, token });

      if (result.data) router.refresh();
      else if (result.serverError) {
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
            if (key === 'token') setTokenError(true);
            else setError(key, { message });
          }
        }
      }
    } catch (err) {
      setError('root', {
        message:
          err instanceof Error
            ? err.message
            : 'Unable to update password. Please check your internet connection.',
      });
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div className="relative">
          <label className="sr-only" htmlFor="password">
            New Password
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
            className={fieldClassName}
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
          <p className="mt-1.5 text-xs text-red">{errors.password.message}</p>
        ) : null}
      </div>

      <div>
        <div className="relative">
          <label className="sr-only" htmlFor="confirm_password">
            Confirm New Password
          </label>
          <i
            className="fas fa-lock pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sm text-secondary-font"
            aria-hidden="true"
          />
          <input
            id="confirm_password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Confirm Password"
            maxLength={128}
            className={fieldClassName}
            {...register('confirm_password')}
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
        {errors.confirm_password ? (
          <p className="mt-1.5 text-xs text-red">
            {errors.confirm_password.message}
          </p>
        ) : null}
      </div>

      {tokenError ? (
        <p
          className="rounded-xl bg-red/10 px-3 py-2.5 text-sm text-red"
          role="alert"
        >
          Link expired, please request a new one.
        </p>
      ) : null}

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
            Updating Password...
          </>
        ) : (
          <>
            Update Password
            <i
              className="fas fa-arrow-right text-sm transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </>
        )}
      </button>
    </form>
  );
}
