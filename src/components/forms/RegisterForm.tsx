'use client';
import { registerUser } from '@/lib/auth/registerUser';
import {
  registerSchema,
  RegisterSchemaType,
} from '@/lib/common/schemas/register';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRef } from 'react';
import { useSearchParams } from 'next/navigation';
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
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      confirm_email: '',
      password: '',
      referral: searchParams.get('ref') ?? undefined,
      captchaToken: '',
    },
  });

  async function onSubmit(values: RegisterSchemaType) {
    try {
      const result = await registerUser(values);

      if (!result.success) {
        setError('root', { message: result.message ?? 'Registration failed.' });
        return;
      }

      // show a toast maybe?
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
        <label htmlFor="confirm_email">Confirm Email</label>
        <input
          id="confirm_email"
          tabIndex={-1}
          autoComplete="off"
          {...register('confirm_email')}
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
