import { z } from 'zod';

export const AnalysisSchema = z.object({
  stats: z.object({
    averageScore: z.number(),
    vagueCommits: z.number(),
    oneWordCommits: z.number(),
  }),

  badCommits: z.array(
    z.object({
      message: z.string(),
      score: z.number(),
      issue: z.string(),
      better: z.string(), // Forced requirement
    }),
  ),

  goodCommits: z.array(
    z.object({
      message: z.string(),
      score: z.number(),
      why: z.string(),
    }),
  ),
});

export const writeCommitSchema = z.object({
  changes: z.array(z.string()).describe('List of detected changes'),
  message: z
    .string()
    .describe('Suggested commit message in conventional format'),
});
