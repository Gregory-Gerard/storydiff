import { z } from 'zod';

export const Spec = z.object({
  id: z.string(),
  name: z.string(),
});
