import { streamText, Output } from 'ai';
import { model } from './config.js';
import { AnalysisSchema, writeCommitSchema } from './schema.js';
import { ANALYSIS_SYSTEM_PROMPT, getAnalysisPrompt } from './prompt.js';
import { WRITE_BETTER_COMMIT_MESSAGE_PROMPT } from './prompt.js';
import { getStagedDiff } from '../services/git.js';

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

export async function writeCommits() {
  const diff = getStagedDiff();

  const { partialOutputStream } = streamText({
    model,
    system: WRITE_BETTER_COMMIT_MESSAGE_PROMPT,
    prompt: `Analyze these git changes and suggest a commit message:\n\n${diff}`,
    output: Output.object({ schema: writeCommitSchema }),
    maxTokens: 2000,
  });

  let result;
  for await (const partial of partialOutputStream) {
    result = partial;
  }

  return result;
}
