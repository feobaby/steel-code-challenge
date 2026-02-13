import ora from 'ora';
import { writeCommits } from '../ai/commit.js';
import { logger } from '../utils/logger.js';
import {
  executeCommit,
  promptForCommitMessage,
} from '../commands/write-command.js';

export async function analyzeStaged() {
  try {
    const spinner = ora('Just a moment...').start();

    const result = await writeCommits();

    spinner.stop();
    process.stdout.write('\r\x1b[K');

    logger.log('Changes detected:');
    result.changes?.forEach((change) => logger.log(`- ${change}`));

    logger.log('\nSuggested commit message:');
    logger.log('━'.repeat(30));
    logger.log(result.message);
    logger.log('━'.repeat(30));
    logger.log('');

    const finalMessage = await promptForCommitMessage(result.message);

    if (finalMessage) {
      executeCommit(finalMessage);
    } else {
      logger.log('Commit Successful!');
    }
  } catch (error) {
    logger.error(
      'Failed to generate commit message. Try again or write manually.',
    );
    throw error;
  }
}
