export function mergeResults(results, batches, totalMessages) {
  return {
    stats: {
      averageScore:
        results.reduce(
          (sum, r, i) => sum + r.stats.averageScore * batches[i].length,
          0,
        ) / totalMessages,
      vagueCommits: results.reduce((sum, r) => sum + r.stats.vagueCommits, 0),
      oneWordCommits: results.reduce(
        (sum, r) => sum + r.stats.oneWordCommits,
        0,
      ),
    },
    badCommits: results.flatMap((r) => r.badCommits),
    goodCommits: results.flatMap((r) => r.goodCommits),
  };
}
