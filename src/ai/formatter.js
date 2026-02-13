export function prepareAnalysisView(result, total) {
  const worstCommits = result.badCommits
    .sort((a, b) => a.score - b.score)
    .slice(0, 2)
    .map((commit) => ({
      message: commit.message,
      score: commit.score,
      issue: commit.issue,
      better: commit.better,
    }));
  const bestCommits = result.goodCommits
    .sort((a, b) => b.score - a.score)
    .slice(0, 1)
    .map((commit) => ({
      message: commit.message,
      score: commit.score,
      why: commit.why,
    }));
  return {
    bad: worstCommits,
    good: bestCommits,
    stats: {
      average: result.stats.averageScore,
      vague: `${result.stats.vagueCommits} (${((result.stats.vagueCommits / total) * 100).toFixed(2)}%)`,
      oneWord: `${result.stats.oneWordCommits} (${((result.stats.oneWordCommits / total) * 100).toFixed(2)}%)`,
    },
  };
}
