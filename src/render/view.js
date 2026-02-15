import chalk from 'chalk';
import { logger } from '../utils/logger.js';

const LINE_LENGTH = 30;
const THICK_LINE = '━'.repeat(LINE_LENGTH);
const changeColumnColor = chalk.hex('#e7ae3d')(':');
const changeColorforTen = chalk.hex('#d1949e')(10);
const changeSlashColor = chalk.hex('#f0efed')('/');

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
  const indent = ' '.repeat(9);

  const formattedMessageCommit = c.message.replace(/\n/g, `\n${indent}`);

  const commitColor =
    type === 'bad' ? chalk.hex('#a6c44c') : chalk.hex('#f0efed');
  logger.log(
    `${chalk.bold('Commit')}${changeColumnColor} "${commitColor(formattedMessageCommit)}"`,
  );
  logger.log(
    `${chalk.bold('Score')}${changeColumnColor}  ${chalk.hex('#d1949e')(c.score)}${changeSlashColor}${chalk.hex('#d1949e')(changeColorforTen)}`,
  );

  if (type === 'bad') {
    const formattedMessageBetterCommit = c.better.replace(/\n/g, `\n${indent}`);
    logger.log(`${chalk.bold('Issue:')}  ${c.issue}`);

    const betterColor = /describe/i.test(c.better)
      ? chalk.hex('#f0efed')
      : chalk.hex('#a6c44c');
    logger.log(
      `${chalk.bold('Better')}${changeColumnColor} ${betterColor(formattedMessageBetterCommit)}`,
    );
  } else {
    logger.log(`${chalk.bold("Why it's good")}${changeColumnColor} ${c.why}`);
  }

  logger.log('');
}

function renderStats(stats) {
  const formattedAvg = Number(stats.average).toFixed(2);
  const changeColorofForFormattedAvg = chalk.hex('#d1949e')(formattedAvg);
  const formatStat = (value) => {
    const match = value
      ? value.toString().match(/(\d+)\s*\(([\d.]+)%\)/)
      : null;

    if (match) {
      const [_, count, percent] = match;
      return `${chalk.hex('#d1949e')(count)} (${chalk.hex('#d1949e')(percent)}%)`;
    }
    return chalk.hex('#d1949e')(value);
  };

  logger.log(
    `${chalk.bold('Average score')}${changeColumnColor} ${changeColorofForFormattedAvg}${changeSlashColor}${chalk.hex('#d1949e')(10)}`,
  );

  logger.log(
    `${chalk.bold('Vague commits')}${changeColumnColor} ${formatStat(stats.vague)}`,
  );

  logger.log(
    `${chalk.bold('One-word commits')}${changeColumnColor} ${formatStat(stats.oneWord)}\n`,
  );
}

export function renderAnalysis(view) {
  renderHeader(themeSections.bad.icon, themeSections.bad.title);
  view.bad.forEach((c) => renderCommit(c, 'bad'));

  renderHeader(themeSections.good.icon, themeSections.good.title);
  view.good.forEach((c) => renderCommit(c, 'good'));

  renderHeader(themeSections.stats.icon, themeSections.stats.title, false);
  renderStats(view.stats);
}
