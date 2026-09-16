'use client';

import { emailSchema, EmailSchemaType } from '@/lib/schemas/email';
import { EmailFormProps } from '@/lib/types/emailAction';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

const fieldClassName =
  'w-full rounded-xl bg-secondary-bg py-3.5 pr-4 pl-11 text-base text-foreground outline-none pr-12 placeholder:text-secondary-font transition-colors duration-300 focus:bg-tertiary-bg';

export default function EmailForm({
  action,
  type,
  submitLabel = 'Submit',
  submittingLabel = 'Submitting...',
}: EmailFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: EmailSchemaType) {
    try {
      const result = await action(values);
      console.log(result);

      if (result.data)
        router.replace(`/check-inbox?type=${type}&email=${values.email}`);
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
            setError(key, { message });
          }
        }
      }
    } catch (err) {
      setError('root', {
        message:
          err instanceof Error
            ? err.message
            : 'Unable to request password reset link. Please check your internet connection.',
      });
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
            {submittingLabel}...
          </>
        ) : (
          <>
            {submitLabel}
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
