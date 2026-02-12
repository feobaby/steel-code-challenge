export function prepareAnalysisView(result, total) {
  return {
    bad: result.badCommits.map((c) => ({
      message: c.message,
      score: c.score,
      issue: c.issue,
      better: c.better,
    })),
    good: result.goodCommits.map((c) => ({
      message: c.message,
      score: c.score,
      why: c.why,
    })),
    stats: {
      average: result.stats.averageScore, // Changed key name to 'average'
      vague: `${Math.round((result.stats.vagueCommits / 100) * total)} (${result.stats.vagueCommits}%)`,
      oneWord: `${Math.round((result.stats.oneWordCommits / 100) * total)} (${result.stats.oneWordCommits}%)`,
    },
  };
}
