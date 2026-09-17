'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DEFAULT_TOPICS,
  onboardingSchema,
  OnboardingSchemaType,
} from '@/app/onboarding/schemas';
import { onboardUserAction } from '@/app/onboarding/actions';
import { useRouter } from 'next/navigation';

export default function OnboardingForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      topics: [],
    },
  });

  const [page, setPage] = useState<boolean>(false);

  async function onSubmit(values: OnboardingSchemaType) {
    try {
      const result = await onboardUserAction(values);

      if (result.data) router.refresh();
      else if (result.serverError) {
        setError('root', {
          message: result.serverError,
        });
      } else if (result.validationErrors) {
        setError('root', {
          message:
            'Please choose 1 to 5 topics, you can always change this later',
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="content">
        {!page && (
          <section>
            <h1>Pick your topics!</h1>
            <p>
              Pick your interests and have them appear right in your home page.{' '}
              <b>You can always change them later.</b>
            </p>

            <fieldset className="rounded-2xl">
              <legend>Interests</legend>
              {DEFAULT_TOPICS.map((topic) => (
                <label key={topic}>
                  <input
                    type="checkbox"
                    value={topic}
                    {...register('topics')}
                  />
                  {topic}
                </label>
              ))}
              {errors.topics && <p></p>}
            </fieldset>
          </section>
        )}

        {page && <section>kip wanted a temporary second page</section>}
      </div>
      <section>
        <button className="bg-primary" onClick={() => setPage((prev) => !prev)}>
          Previous
        </button>

        <button className="bg-primary" onClick={() => setPage((prev) => !prev)}>
          Previous
        </button>

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
      </section>
    </form>
  );
}
