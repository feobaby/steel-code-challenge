import chalk from 'chalk';
import { logger } from '../utils/logger.js';

const thickLine = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━';

export const renderHeader = (icon, title) => {
  logger.log(`\n${thickLine}`);
  logger.log(chalk.bold(`${icon} ${title}`));
  logger.log(`${thickLine}\n`);
};
