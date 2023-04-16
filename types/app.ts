import { z } from 'zod';

export const App = z.object({
  id: z.string(),
  webUrl: z.string().url(),
  name: z.string(),
  userCount: z.number(),
});

export type App = z.infer<typeof App>;
