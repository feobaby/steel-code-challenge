import { z } from 'zod';

export const AnalysisSchema = z.object({
  stats: z
    .object({
      averageScore: z.coerce.number().catch(0),
      vagueCommits: z.coerce.number().catch(0),
      oneWordCommits: z.coerce.number().catch(0),
    })
    .default({ averageScore: 0, vagueCommits: 0, oneWordCommits: 0 }),

  badCommits: z
    .array(
      z.object({
        message: z.string().default('Unknown'),
        score: z.coerce.number().catch(0),
        issue: z.string().default('General issue'),
        better: z.string().default('Improve clarity'),
      }),
    )
    .catch([])
    .default([]),

  goodCommits: z
    .array(
      z.object({
        message: z.string().default('Unknown'),
        score: z.coerce.number().catch(10),
        why: z.string().default('Good structure'),
      }),
    )
    .catch([])
    .default([]),
});

export const writeCommitSchema = z.object({
  changes: z.array(z.string()).describe('List of detected changes'),
  message: z
    .string()
    .describe('Suggested commit message in conventional format'),
});
