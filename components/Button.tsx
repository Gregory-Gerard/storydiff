import React, { ForwardedRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type ButtonOwnProps<T extends React.ElementType = React.ElementType> = React.PropsWithChildren<{
  variant?: 'primary' | 'ghost' | undefined;
  loading?: boolean | undefined;
  as?: T;
}>;

type ButtonProps<T extends React.ElementType> = ButtonOwnProps<T> &
  Omit<React.ComponentPropsWithRef<T>, keyof ButtonOwnProps>;

const Button: <T extends React.ElementType = 'button'>(props: ButtonProps<T>) => React.ReactElement | null =
  React.forwardRef(function Button<T extends React.ElementType = 'button'>(
    { variant = 'primary', as, loading, children, className, ...props }: ButtonProps<T>,
    forwardedRef: ForwardedRef<HTMLButtonElement>
  ) {
    const Component = as || 'button';

    return (
      <Component
        {...props}
        className={cn(
          'rounded border border-transparent px-3 py-2 text-center font-medium shadow-sm focus:outline-0 disabled:opacity-75 ',
          {
            'cursor-not-allowed': loading,
            'bg-brand-500 text-white hover:bg-brand-600 focus:border-brand-500/50 focus:ring focus:ring-brand-500/20':
              variant === 'primary',
            'bg-transparent text-neutral-300 shadow-none hover:bg-neutral-900 focus:border-brand-500/50 focus:ring focus:ring-brand-500/20':
              variant === 'ghost',
          },
          className
        )}
        disabled={loading}
        ref={forwardedRef}
      >
        {!loading ? children : <Loader2 className="mx-auto animate-spin" />}
      </Component>
    );
  });

export default Button;
