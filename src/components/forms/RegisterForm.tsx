'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  registerInputSchema,
  RegisterInputSchemaType,
} from '@/app/register/schemas';
import { registerUser } from '@/app/register/actions';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export default function RegisterForm() {
  const captchaRef = useRef<HCaptcha>(null);
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
      const result = await registerUser(values);

      if (result.data) {
        // show a toast maybe?
        // redirct to /check-inbox?
      } else if (result.serverError) {
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
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" {...register('username')} />
        {errors.username && <p role="alert">{errors.username.message}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <p role="alert">{errors.email.message}</p>}
      </div>

      {/* honeypot kept hidden off-screen, never shown to real users */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label htmlFor="confirmEmail">Confirm Email</label>
        <input
          id="confirmEmail"
          tabIndex={-1}
          autoComplete="off"
          {...register('confirmEmail')}
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <p role="alert">{errors.password.message}</p>}
      </div>

      <HCaptcha
        ref={captchaRef}
        sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
        onVerify={(token) =>
          setValue('captchaToken', token, { shouldValidate: true })
        }
        onExpire={() => setValue('captchaToken', '', { shouldValidate: true })}
        onError={() => setValue('captchaToken', '', { shouldValidate: true })}
      />
      {errors.captchaToken && <p role="alert">{errors.captchaToken.message}</p>}

      {errors.root && <p role="alert">{errors.root.message}</p>}

      <button type="submit" disabled={isSubmitting} className="cursor-pointer">
        {isSubmitting ? 'Creating account...' : 'Register'}
      </button>
    </form>
  );
}
