import { z } from 'zod';

export const Build = z.object({
  id: z.string(),
  webUrl: z.string().url(),
  storybookUrl: z.string().url(),
  branch: z.string(),
  commit: z.string(),
  result: z.enum(['SUCCESS', 'CAPTURE_ERROR', 'SYSTEM_ERROR', 'TIMEOUT']),
  specCount: z.number(),
  number: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Build = z.infer<typeof Build>;
