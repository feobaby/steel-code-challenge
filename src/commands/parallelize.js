import { analyzeCommits } from '../ai/commit.js';
import pLimit from 'p-limit';
import chalk from 'chalk';
import * as p from '@clack/prompts';

export async function analyzeInParallel(batches) {
  const limit = pLimit(2);

  p.intro(
    chalk.green('Currently fetching and analyzing your last 50 commits...'),
  );

  const progress = p.spinner();
  progress.start('Processing commits');

  let completed = 0;

  const results = await Promise.all(
    batches.map((batch) =>
      limit(async () => {
        const result = await analyzeCommits(batch);
        completed++;
        progress.message(`Processing commits (${completed}/${batches.length})`);
        return result;
      }),
    ),
  );

  progress.stop(chalk.green('✔ Done!'));
  return results.flat();
}
