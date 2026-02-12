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
