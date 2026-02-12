import { execSync } from 'child_process';
import { readFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { succeedSpinner, failSpinner } from '../utils/spinner.js';
import { logger } from '../utils/logger.js';

import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export async function promptForCommitMessage(suggestedMessage) {
  const rl = createInterface({ input, output });

  try {
    const answer = await rl.question(
      'Press Enter to accept, or type your own message:\n> ',
    );
    rl.close(); // Close immediately after getting answer

    const trimmedAnswer = answer.trim();

    if (trimmedAnswer.toLowerCase() === 'git commit') {
      try {
        execSync('git commit', { stdio: 'inherit' });
        return null;
      } catch (error) {
        failSpinner('Commit failed', error.message);
      }
    }
    return trimmedAnswer || suggestedMessage;
  } catch (error) {
    rl.close(); // Close on error too
    throw error; // Re-throw so caller can handle it
  }
}

export function executeCommit(message) {
  try {
    const escapedMessage = message.replace(/"/g, '\\"');
    execSync(`git commit -m "${escapedMessage}"`, {
      stdio: 'inherit',
    });
    succeedSpinner('Commit Successful!');
    return true;
  } catch (error) {
    failSpinner(`Commit failed: ${error.message}`);
    process.exit(1);
  }
}

export function openEditorForMessage() {
  const tempFile = join(tmpdir(), `COMMIT_EDITMSG_${Date.now()}`);

  try {
    const editor = process.env.EDITOR || process.env.VISUAL || 'vi';
    execSync(`${editor} ${tempFile}`, { stdio: 'inherit' });

    const finalMessage = readFileSync(tempFile, 'utf-8').trim();
    unlinkSync(tempFile);

    if (!finalMessage) {
      logger.log('\nEmpty commit message. Commit cancelled.');
      return null;
    }

    return finalMessage;
  } catch (error) {
    try {
      unlinkSync(tempFile);
    } catch {
      // Ignore cleanup errors
    }
    throw error;
  }
}
