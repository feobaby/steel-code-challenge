import { streamText, Output } from 'ai';
import { model } from './config.js';
import { AnalysisSchema } from './schema.js';
import { ANALYSIS_SYSTEM_PROMPT, getAnalysisPrompt } from './prompt.js';
import { execSync } from 'child_process';
import { failSpinner } from '../utils/spinner.js';
import { z } from 'zod';
import { WRITE_BETTER_COMMIT_MESSAGE_PROMPT } from '../ai/prompt.js';

export async function analyzeCommits(messages, onProgress) {
  const { partialOutputStream } = streamText({
    model,
    system: ANALYSIS_SYSTEM_PROMPT,
    prompt: getAnalysisPrompt(messages),
    output: Output.object({ schema: AnalysisSchema }),
    maxTokens: 2000,
  });

  let result;

  for await (const partial of partialOutputStream) {
    result = partial;

    onProgress?.({
      badCount: partial.badCommits?.length ?? 0,
      goodCount: partial.goodCommits?.length ?? 0,
      total: messages.length,
      partial,
    });
  }
  result = {
    stats: result?.stats || {
      averageScore: 0,
      vagueCommits: 0,
      oneWordCommits: 0,
    },
    badCommits: result?.badCommits || [],
    goodCommits: result?.goodCommits || [],
  };

  return result;
}


export async function getStagedChanges() {
  // Get staged diff
  const diff = execSync('git diff --staged', { encoding: 'utf-8' });

  if (!diff.trim()) {
    failSpinner('No staged changes found. Use `git add` first.');
    process.exit(1);
  }

  // Get file stats
  const stats = execSync('git diff --staged --stat', { encoding: 'utf-8' });
  const lines = stats.split('\n');
  const summary = lines[lines.length - 2];

  console.log(`Analyzing staged changes... (${summary.trim()})\n`);

  // Generate commit message with AI
  const { partialOutputStream } = streamText({
    model,
    system: WRITE_BETTER_COMMIT_MESSAGE_PROMPT,
    prompt: `Analyze these git changes and suggest a commit message:\n\n${diff}`,
    output: Output.object({
      schema: z.object({
        changes: z.array(z.string()).describe('List of detected changes'),
        message: z.string().describe('Suggested commit message in conventional format')
      })
    }),
    maxTokens: 1000,
  });

  let result;
  for await (const partial of partialOutputStream) {
    result = partial;
  }

  return result;
}