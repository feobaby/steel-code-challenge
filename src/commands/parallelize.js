import { analyzeCommits } from '../ai/commit.js';
import pLimit from 'p-limit';
import ora from 'ora';
import chalk from 'chalk';

export async function analyzeInParallel(batches) {
  const limit = pLimit(2);
  const spinner = ora(
    `Analyzing last ${chalk.hex('#d1949e')(50)} commits...`,
  ).start();

  let completed = 0;

  const results = await Promise.all(
    batches.map((batch) =>
      limit(async () => {
        const result = await analyzeCommits(batch);
        completed++;
        spinner.text = `Processing commits (${completed}/${batches.length})`;
        return result;
      }),
    ),
  );
  spinner.stop();
  spinner.stopAndPersist({
    symbol: '',
    text: `Analyzing last ${chalk.hex('#d1949e')(50)} commits...`,
  });
  return results.flat();
}
