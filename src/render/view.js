import chalk from 'chalk';
import { logger } from '../utils/logger.js';

const LINE_LENGTH = 30;
const THICK_LINE = '━'.repeat(LINE_LENGTH);

const themeSections = {
  bad: { icon: '💩', title: 'COMMITS THAT NEED WORK' },
  good: { icon: '💎', title: 'WELL-WRITTEN COMMITS' },
  stats: { icon: '📊', title: 'YOUR STATS' },
};

function renderHeader(icon, title, hasBottomPadding = true) {
  logger.log(`\n${THICK_LINE}`);
  logger.log(chalk.bold(`${icon} ${title}`));

  const bottomLine = hasBottomPadding ? `${THICK_LINE}\n` : THICK_LINE;
  logger.log(bottomLine);
}
function renderCommit(c, type) {
  const scoreColor = type === 'bad' ? chalk.yellow : chalk.cyan;
  const indent = ' '.repeat(9);

  const formattedMessage = c.message.replace(/\n/g, `\n${indent}`);

  logger.log(`${chalk.bold('Commit:')} "${chalk.white(formattedMessage)}"`);
  logger.log(`${chalk.bold('Score:')}  ${scoreColor(`${c.score}/10`)}`);

  if (type === 'bad') {
    logger.log(`${chalk.bold('Issue:')}  ${c.issue}`);
    logger.log(`${chalk.bold('Better:')} ${chalk.green(c.better)}`);
  } else {
    logger.log(`${chalk.bold("Why it's good:")} ${c.why}`);
  }
  logger.log('');
}

function renderStats(stats) {
  const formattedAvg = Number(stats.average).toFixed(2);
  logger.log(`${chalk.bold('Average score:')} ${formattedAvg}/10`);
  logger.log(`${chalk.bold('Vague commits:')} ${stats.vague}`);
  logger.log(`${chalk.bold('One-word commits:')} ${stats.oneWord}\n`);
}

export function renderAnalysis(view) {
  renderHeader(themeSections.bad.icon, themeSections.bad.title);
  view.bad.forEach((c) => renderCommit(c, 'bad'));

  renderHeader(themeSections.good.icon, themeSections.good.title);
  view.good.forEach((c) => renderCommit(c, 'good'));

  renderHeader(themeSections.stats.icon, themeSections.stats.title, false);
  renderStats(view.stats);
}
