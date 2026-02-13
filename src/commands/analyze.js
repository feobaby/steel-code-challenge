import chalk from 'chalk';
import { getLocalCommits, getRemoteCommits } from '../services/git.js';
import { renderAnalysis } from '../render/view.js';
import { prepareAnalysisView } from '../ai/formatter.js';
import { logger } from '../utils/logger.js';
import { createBatches } from './batching.js';
import { analyzeInParallel } from './parallelize.js';
import { mergeResults } from './merging.js';
import {
  startSpinner,
  infoSpinner,
  stopSpinner,
  updateSpinner,
} from '../utils/spinner.js';

export async function analyzeAction(options) {
  const { url } = options;
  const count = 10;

  try {
    startSpinner('Fetching commits...');
    const messages = url
      ? await getRemoteCommits(url, count)
      : await getLocalCommits(count);

    if (!messages || messages.length === 0) {
      infoSpinner(chalk.yellow('No commits found to analyze.'));
      return;
    }

    updateSpinner('Hi! I am currently generating a critique for you...');
    const batches = createBatches(messages);
    const results = await analyzeInParallel(batches);

    const mergedResult = mergeResults(results, batches, messages.length);
    const viewData = prepareAnalysisView(mergedResult, messages.length);

    stopSpinner();

    renderAnalysis(viewData);
  } catch (error) {
    logger.error(`Analysis failed. ${error.message}`);
  }
}
