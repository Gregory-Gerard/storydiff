'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';
import { z } from 'zod';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Tooltip from '@/components/Tooltip';
import useForm from '@/hooks/use-form';

export default function Page() {
  const router = useRouter();

  // If user is already connected, redirect to app
  getSession().then((session) => {
    if (session?.chromaticToken) {
      router.push('/app');
    }
  });

  const {
    register,
    onSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
    async onSubmit(payload) {
      const result = await signIn('credentials', {
        ...payload,
        redirect: false,
        callbackUrl: '/app',
      });

      if (!result || result.error || !result.ok) {
        const errorMapping: Record<string, string> = {
          CredentialsSignin: 'Incorrect email or password.',
          undefined: 'Unknow error, please retry.',
        };

        setError('root', { message: errorMapping[result?.error || 'undefined'] || errorMapping['undefined'] });
        return;
      }

      router.push('/app');
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex w-96 flex-col gap-4 rounded p-4 shadow-outline">
        <h1 className="flex items-center gap-3 text-base font-bold">
          <span>Login</span>

          <Tooltip content="Enter your Chromatic credentials">
            <span className="flex h-5 w-5 cursor-default items-center justify-center rounded-full border border-neutral-600 text-xs font-medium text-neutral-600 hover:bg-neutral-900">
              ?
            </span>
          </Tooltip>
        </h1>

        <form className="flex flex-col gap-3" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1">
            <Input
              type="email"
              label="Email"
              autoFocus
              error={errors.email?.message || errors.root?.message}
              {...register('email')}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Input type="password" label="Password" error={errors.password?.message} {...register('password')} />
          </div>

          <Button loading={isSubmitting}>Login</Button>
        </form>
      </div>
    </div>
  );
}
