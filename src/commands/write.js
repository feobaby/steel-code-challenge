import ora from 'ora';
import chalk from 'chalk';
import { writeCommits } from '../ai/commit.js';
import { logger } from '../utils/logger.js';
import {
  executeCommit,
  promptForCommitMessage,
} from '../commands/write-command.js';

export async function analyzeStaged() {
  try {
    const yellowColon = chalk.hex('#e7ae3d')(':');
    const yellowDash = chalk.hex('#e7ae3d')('-');
    const greenType = chalk.hex('#a6c44c');

    const formatDash = (str) => str.replace(/^- /gm, `${yellowDash} `);

    const spinner = ora('Just a moment...').start();
    const result = await writeCommits();

    spinner.stop();

    logger.log(`Changes detected${yellowColon}`);
    result.changes?.forEach((change) => {
      const line = change.startsWith('- ') ? change : `- ${change}`;
      logger.log(formatDash(line));
    });

    logger.log(`\nSuggested commit message${yellowColon}`);
    logger.log('━'.repeat(30));

    const formattedMessage = formatDash(result.message).replace(
      /^(\w+)(?:\(([^)]+)\))?(:)/,
      (_, type, scope, _colon) => {
        const coloredType = greenType(type);
        const coloredScope = scope ? `(${scope})` : '';
        const coloredColon = yellowColon;
        return `${coloredType}${coloredScope}${coloredColon}`;
      },
    );

    logger.log(formattedMessage);
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
