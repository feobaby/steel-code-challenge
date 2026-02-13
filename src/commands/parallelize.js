import { analyzeCommits } from '../ai/commit.js';
import { infoSpinner } from '../utils/spinner.js';

import pLimit from 'p-limit';

export async function analyzeInParallel(batches) {
  const limit = pLimit(2);

  return await Promise.all(
    batches.map((batch, idx) =>
      limit(() =>
        analyzeCommits(batch, ({ badCount, goodCount }) => {
          infoSpinner(
            `Batch ${idx + 1}/${batches.length}: ${badCount + goodCount}/${batch.length} commits`,
          );
        }),
      ),
    ),
  );
}
