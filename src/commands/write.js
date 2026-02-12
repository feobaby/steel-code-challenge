import {
  failSpinner,
  startSpinner,
  stopSpinner,
  succeedSpinner,
} from '../utils/spinner.js';
import { writeCommits } from '../ai/service.js';
import { logger } from '../utils/logger.js';
import { executeCommit, promptForCommitMessage } from './commit.js';

export async function analyzeStaged() {
  try {
    startSpinner('Hold on ...');
    const result = await writeCommits();

    logger.log('\nChanges detected:');
    result.changes?.forEach((change) => logger.log(`- ${change}`));

    logger.log('\nSuggested commit message:');
    logger.log('━'.repeat(30));
    logger.log(result.message);
    logger.log('━'.repeat(30));
    stopSpinner();

    const finalMessage = await promptForCommitMessage(result.message);

    if (finalMessage) {
      executeCommit(finalMessage);
    } else {
      succeedSpinner('Commit Successful!');
    }
  } catch (error) {
    failSpinner(
      'Failed to generate commit message. Try again or write manually.',
    );
    logger.log(error.message);
    throw error;
  }
}
