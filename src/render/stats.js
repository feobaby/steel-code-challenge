import { logger } from '../utils/logger.js';
import chalk from 'chalk';

export const renderStats = (stats) => {
  logger.log(`${chalk.bold('Average score:')} ${stats.average}/10`);
  logger.log(`${chalk.bold('Vague commits:')} ${stats.vague}`);
  logger.log(`${chalk.bold('One-word commits:')} ${stats.oneWord}\n`);
};
