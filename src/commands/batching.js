export function createBatches(messages, batchCount = 4) {
  const batchSize = Math.round(messages.length / batchCount);
  const batches = [];

  for (let i = 0; i < batchCount; i++) {
    const start = i * batchSize;
    const end = Math.min(start + batchSize, messages.length);
    if (start < messages.length) {
      batches.push(messages.slice(start, end));
    }
  }
  return batches;
}
