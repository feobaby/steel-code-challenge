import { analyzeCommits } from '../ai/commit.js';
import pLimit from 'p-limit';
import ora from 'ora';

export async function analyzeInParallel(batches) {
  const limit = pLimit(2);

  const spinner = ora('Analyzing last 50 commits...').start();

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
  process.stdout.write('\r\x1b[K');
  spinner.stopAndPersist({
    symbol: '',
    text: 'Analyzing last 50 commits...',
  });
  return results.flat();
}


