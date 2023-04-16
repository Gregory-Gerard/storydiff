import React, { ForwardedRef, useId } from 'react';
import { cn } from '@/lib/utils';

type InputProps = {
  label?: string | undefined;
  error?: string | boolean | undefined;
  icon?: React.ElementType<React.ComponentPropsWithoutRef<'svg'>> | undefined;
} & React.ComponentPropsWithRef<'input'>;

export default React.forwardRef(function Input(
  { label, className, type, error, icon: Icon, ...props }: InputProps,
  forwardedRef: ForwardedRef<HTMLInputElement>
) {
  const id = useId();
  const errorId = useId();

  return (
    <>
      {label && (
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />}

        <input
          type={type || 'text'}
          id={id}
          className={cn(
            'w-full rounded border px-3 py-2 shadow-sm focus:ring',
            { 'border-red-400 focus:border-red-400 focus:ring-red-500/20': !!error },
            { 'pl-9': !!Icon },
            className
          )}
          aria-invalid={!!error}
          {...(typeof error === 'string' ? { 'aria-describedby': errorId } : {})}
          ref={forwardedRef}
          {...props}
        />
      </div>

      {typeof error === 'string' && (
        <small id={errorId} className="text-red-500">
          {error}
        </small>
      )}
    </>
  );
});
