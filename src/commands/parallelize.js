import { analyzeCommits } from '../ai/commit.js';
import pLimit from 'p-limit';
import ora from 'ora';

export async function analyzeInParallel(batches) {
  const limit = pLimit(2);

  const spinner = ora(
    'Processing 50 commits (0/' + batches.length + ')',
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
  process.stdout.write('\r\x1b[K');

  return results.flat();
}
