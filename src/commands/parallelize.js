import { analyzeCommits } from '../ai/commit.js';
import { logger } from '../utils/logger.js';

import pLimit from 'p-limit';

export async function analyzeInParallel(batches) {
  const limit = pLimit(2);

  return await Promise.all(
    batches.map((batch, idx) =>
      limit(() =>
        analyzeCommits(batch, ({ badCount, goodCount }) => {
          logger.log(
            `Batch ${idx + 1}/${batches.length}: ${badCount + goodCount}/${batch.length} commits`,
          );
        }),
      ),
    ),
  );
}
