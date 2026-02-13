import chalk from 'chalk';
import { getLocalCommits, getRemoteCommits } from '../services/git.js';
import { renderAnalysis } from '../render/view.js';
import { prepareAnalysisView } from '../ai/formatter.js';
import { logger } from '../utils/logger.js';
import { createBatches } from './batching.js';
import { analyzeInParallel } from './parallelize.js';
import { mergeResults } from './merging.js';

export async function analyzeAction(options) {
  const { url } = options;
  const count = 50;

  try {
    const messages = url
      ? await getRemoteCommits(url, count)
      : await getLocalCommits(count);

    if (!messages || messages.length === 0) {
      logger.error(chalk.yellow('No commits found to analyze.'));
      return;
    }
    const batches = createBatches(messages);
    const results = await analyzeInParallel(batches);

    const mergedResult = mergeResults(results, batches, messages.length);
    const viewData = prepareAnalysisView(mergedResult, messages.length);

    renderAnalysis(viewData);
  } catch (error) {
    logger.error(`Analysis failed. ${error.message}`);
  }
}
