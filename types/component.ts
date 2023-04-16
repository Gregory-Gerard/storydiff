import { z } from 'zod';

export const Component = z.object({
  id: z.string(),
  csfId: z.string(),
  name: z.string(),
  displayName: z.string(),
  path: z.string().array(),
});

export type Component = z.infer<typeof Component>;
