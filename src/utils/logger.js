import chalk from 'chalk';

export const logger = {
  log: (msg) => process.stdout.write(msg + '\n'),
  error: (msg) => process.stderr.write(chalk.red(msg) + '\n'),
};
