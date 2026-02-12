import { simpleGit } from 'simple-git';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';

export async function getLocalCommits(count = 50) {
  const git = simpleGit();
  const isRepo = await git.checkIsRepo();
  if (!isRepo) throw new Error('Not a local git repository.');

  const log = await git.log({ maxCount: count });
  return log.all.map((c) => c.message);
}

export async function getRemoteCommits(url, count = 50) {
  // Create a temporary directory
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'steel-git-'));

  try {
    const git = simpleGit();

    // Bare + shallow clone (fastest local clone)
    await git.clone(url, tempDir, [
      '--bare', // Skip working tree
      '--depth',
      count.toString(), // Only last N commits
      '--filter=blob:none', // Skip file contents
      '--no-tags', // Optional: don't fetch tags
    ]);

    const remoteGit = simpleGit(tempDir);

    // Get commit logs (only metadata)
    const log = await remoteGit.log({
      maxCount: count,
      format: {
        hash: '%H',
        message: '%s',
        body: '%b',
        author_name: '%an',
        author_email: '%ae',
        date: '%ad',
      },
    });

    // Preprocess for LLM
    return log.all.map((c) => ({
      sha: c.hash,
      message: c.message,
      summary:
        c.message.length > 80 ? c.message.slice(0, 77) + '...' : c.message,
      body: c.body,
      author: `${c.author_name} <${c.author_email}>`,
      date: c.date,
    }));
  } finally {
    try {
      // Optional: skip removal if speed is priority
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // Silent fail
    }
  }
}
