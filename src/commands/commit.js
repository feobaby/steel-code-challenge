import { execSync } from 'child_process';
import { readFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { succeedSpinner, failSpinner } from '../utils/spinner.js';
import { logger } from '../utils/logger.js';

import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export async function promptForCommitMessage(suggestedMessage) {
  // Create the interface using the promises API
  const rl = createInterface({ input, output });

  try {
    // No more callbacks! Just await the result.
    const answer = await rl.question('Press Enter to accept, or type your own message:\n> ');
    rl.close();

    const trimmedAnswer = answer.trim();

    // 1. Check for editor trigger
    if (trimmedAnswer.toLowerCase() === 'git commit') {
      const editedMessage = openEditorForMessage(suggestedMessage);
      if (!editedMessage) {
        process.exit(0); // Match your original exit logic
      }
      return editedMessage;
    }

    // 2. Return input or fallback to suggestion
    // (This one line replaces your if/else block)
    return trimmedAnswer || suggestedMessage;

  } catch (error) {
    rl.close();
    throw error; // Let the caller handle the error
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