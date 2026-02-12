import { themeSections } from './theme.js';
import { renderStats } from './stats.js';
import { renderCommit } from './commit.js';
import { renderHeader } from './header.js';

export function renderAnalysis(view) {
  renderHeader(themeSections.bad.icon, themeSections.bad.title);
  view.bad.forEach((c) => renderCommit(c, 'bad'));

  renderHeader(themeSections.good.icon, themeSections.good.title);
  view.good.forEach((c) => renderCommit(c, 'good'));

  renderHeader(themeSections.stats.icon, themeSections.stats.title);
  renderStats(view.stats);
}

import { getStagedChanges } from '../ai/service.js';
import { logger } from '../utils/logger.js';
import { THICK_LINE } from '../render/header.js';

export async function renderWrite() {
  const result = await getStagedChanges();
  logger.log('\nChanges detected:');
  result.changes?.forEach((change) => console.log(`- ${change}`));

  logger.log('\nSuggested commit message:');
  logger.log(`\n${THICK_LINE}`);
  logger.log(result.message);
  logger.log('━'.repeat(30));
}
