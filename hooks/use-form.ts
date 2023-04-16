import {
  FieldValues,
  useForm as useReactHookForm,
  UseFormHandleSubmit,
  UseFormProps as UseReactHookFormProps,
  UseFormReturn as UseReactHookFormReturn,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod/dist/zod';
import { z } from 'zod';
import { ApolloError } from '@apollo/client';

type UseFormProps<T extends z.Schema, U extends FieldValues = z.infer<T>> = Omit<
  UseReactHookFormProps<U>,
  'resolver'
> & {
  onSubmit?: (payload: U) => Promise<void>;
  resolver: T;
};

type UseFormReturn<T extends z.Schema, U extends FieldValues = z.infer<T>> = Omit<
  UseReactHookFormReturn<U>,
  'handleSubmit'
> & {
  onSubmit: ReturnType<UseFormHandleSubmit<U>>;
};

export default function useForm<T extends z.Schema, U extends FieldValues = z.infer<T>>({
  onSubmit,
  resolver,
  ...rest
}: UseFormProps<T, U>): UseFormReturn<T, U> {
  const { handleSubmit, ...form } = useReactHookForm<U>({
    resolver: zodResolver(resolver),
    ...rest,
  });

  return {
    ...form,
    onSubmit: handleSubmit(async (payload: U): Promise<void> => {
      form.clearErrors();

      const parsedPayload = resolver.parse(payload);

      try {
        await onSubmit?.(parsedPayload);
      } catch (e) {
        if (e instanceof ApolloError) {
          processApolloErrors(e, form);
        }
      }
    }),
  };
}

function processApolloErrors<T extends FieldValues>(
  e: ApolloError,
  form: Partial<UseReactHookFormReturn<T>> & Required<Pick<UseReactHookFormReturn<T>, 'getValues' | 'setError'>>
) {
  form.setError('root', { message: e.message });
}
