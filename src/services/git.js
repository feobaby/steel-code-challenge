import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import { execSync } from 'child_process';
import { logger } from '../utils/logger.js';

export function getLocalCommits(count) {
  try {
    const log = execSync(`git log -n ${count} --pretty=format:%B%x00`, {
      encoding: 'utf-8',
    });
    const commits = log
      .split('\0')
      .filter(Boolean)
      .map((msg) => msg.trim());
    return commits;
  } catch (error) {
    logger.error('Failed to fetch local commits.', error.message);
    throw error;
  }
}

export async function getRemoteCommits(url, count) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'git-audit-'));
  try {
    execSync(
      `git clone --bare --depth ${count} --filter=blob:none --no-tags ${url} ${tempDir}`,
      { stdio: 'ignore' },
    );

    const logOutput = execSync(
      `git --git-dir="${tempDir}" log -n ${count} --pretty=format:"%B%x00"`,
      { encoding: 'utf-8' },
    );

    const commits = logOutput
      .split('\0')
      .map((msg) => msg.trim())
      .filter(Boolean);

    return commits;
  } catch (error) {
    logger.error('Failed to fetch remote commits.', error.message);
    throw error;
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
}

export function getStagedDiff() {
  try {
    const gitDiff = execSync('git diff --staged', { encoding: 'utf-8' });
    if (!gitDiff.trim()) {
      logger.error('No staged changes found. Try using `git add` first.');

      process.exit(1);
    }

    const stats = execSync('git diff --staged --stat', { encoding: 'utf-8' });
    const lines = stats.split('\n').filter(Boolean);
    const summary = lines[lines.length - 1] || 'unknown changes';

    logger.log(`Analyzing staged changes... (${summary.trim()})\n`);
    return gitDiff;
  } catch (error) {
    logger.error('Failed to get staged diff.', error.message);
    throw error;
  }
}
