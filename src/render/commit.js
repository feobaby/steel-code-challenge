import { logger } from '../utils/logger.js';
import chalk from 'chalk';

export const renderCommit = (c, type) => {
  const scoreColor = type === 'bad' ? chalk.yellow : chalk.cyan;

  logger.log(`${chalk.bold('Commit:')} "${chalk.white(c.message)}"`);
  logger.log(`${chalk.bold('Score:')}  ${scoreColor(c.score)}`);

  if (type === 'bad') {
    logger.log(`${chalk.bold('Issue:')}  ${c.issue}`);
    logger.log(`${chalk.bold('Better:')} ${chalk.green(c.better)}`);
  } else {
    logger.log(`${chalk.bold("Why it's good:")} ${c.why}`);
  }

  logger.log('');
};
