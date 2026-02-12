import chalk from 'chalk';
import { logger } from '../utils/logger.js';

const LINE_LENGTH = 30;
export const THICK_LINE = '━'.repeat(LINE_LENGTH);

export const renderHeader = (icon, title) => {
  logger.log(`\n${THICK_LINE}`);
  logger.log(chalk.bold(`${icon} ${title}`));
  logger.log(`${THICK_LINE}\n`);
};
