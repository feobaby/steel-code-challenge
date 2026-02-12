import chalk from 'chalk';
import { logger } from '../utils/logger.js';

const LINE_LENGTH = 30;
const THICK_LINE = '━'.repeat(LINE_LENGTH);

const themeSections = {
  bad: { icon: '💩', title: 'COMMITS THAT NEED WORK' },
  good: { icon: '💎', title: 'WELL-WRITTEN COMMITS' },
  stats: { icon: '📊', title: 'YOUR STATS' },
};

function renderHeader(icon, title) {
  logger.log(`\n${THICK_LINE}`);
  logger.log(chalk.bold(`${icon} ${title}`));
  logger.log(`${THICK_LINE}\n`);
}

function renderStats(stats) {
  logger.log(`${chalk.bold('Average score:')} ${stats.average}/10`);
  logger.log(`${chalk.bold('Vague commits:')} ${stats.vague}`);
  logger.log(`${chalk.bold('One-word commits:')} ${stats.oneWord}\n`);
}

function renderCommit(c, type) {
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
}

export function renderAnalysis(view) {
  // Bad Commits
  renderHeader(themeSections.bad.icon, themeSections.bad.title);
  view.bad.forEach((c) => renderCommit(c, 'bad'));

  // Good Commits
  renderHeader(themeSections.good.icon, themeSections.good.title);
  view.good.forEach((c) => renderCommit(c, 'good'));

  // Stats
  renderHeader(themeSections.stats.icon, themeSections.stats.title);
  renderStats(view.stats);
}
