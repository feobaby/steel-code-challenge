import ora from 'ora';
import {  succeedSpinner } from '../utils/spinner.js';
import { writeCommits } from '../ai/commit.js';
import { logger } from '../utils/logger.js';
import {
  executeCommit,
  promptForCommitMessage,
} from '../commands/write-command.js';

export async function analyzeStaged() {
  try {
    const spinner = ora('Analyzing staged changes...');
    const result = await writeCommits();

    logger.log('\nChanges detected:');
    result.changes?.forEach((change) => logger.log(`- ${change}`));

    logger.log('\nSuggested commit message:');
    logger.log('━'.repeat(30));
    logger.log(result.message);
    logger.log('━'.repeat(30));
       spinner.stop();

    const finalMessage = await promptForCommitMessage(result.message);

    if (finalMessage) {
      executeCommit(finalMessage);
    } else {
      succeedSpinner('Commit Successful!');
    }
  } catch (error) {
    logger.error(
      'Failed to generate commit message. Try again or write manually.',
    );

    throw error;
  }
}

