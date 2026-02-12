// import readline from 'readline';
import {
  failSpinner,
  startSpinner,
  stopSpinner,
  succeedSpinner,
} from '../utils/spinner.js';
import { getStagedChanges } from '../ai/service.js';
import { logger } from '../utils/logger.js';
import { executeCommit, promptForCommitMessage } from './commit.js';

export async function analyzeStaged() {
  try {
    startSpinner('Hold on ...');
    const result = await getStagedChanges();

    logger.log('\nChanges detected:');
    result.changes?.forEach((change) => console.log(`- ${change}`));

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
    failSpinner('Analysis failed');
    logger.log(error.message);
    process.exit(1);
  }
}
