import { z } from 'zod';

export const Test = z.object({
  id: z.string(),
  webPath: z.string(),
  comparisons: z
    .object({
      id: z.string(),
      headCapture: z.object({
        resourceKey: z.string(),
        imageUrl: z.string().url(),
        imageSize: z.object({
          width: z.number(),
          height: z.number(),
        }),
        backgroundColor: z.string(),
      }),
    })
    .array(),
  storybookUrl: z.string().url(),
  parameters: z.object({
    viewport: z.number(),
  }),
  status: z.enum(['IN_PROGRESS', 'PASSED', 'PENDING', 'ACCEPTED', 'DENIED', 'BROKEN', 'FAILED']),
  result: z.enum(['EQUAL', 'FIXED', 'ADDED', 'CHANGED', 'CAPTURE_ERROR', 'SYSTEM_ERROR', 'SKIPPED']),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type Test = z.infer<typeof Test>;
