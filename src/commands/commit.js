import { execSync } from 'child_process';
import { readFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { succeedSpinner, failSpinner } from '../utils/spinner.js';
import { logger } from '../utils/logger.js';

export function promptForCommitMessage(rl, suggestedMessage) {
  return new Promise((resolve, reject) => {
    rl.question(
      'Press Enter to accept, or type your own message:\n> ',
      (answer) => {
        rl.close();

        const trimmedAnswer = answer.trim();

        if (trimmedAnswer.toLowerCase() === 'git commit') {
          try {
            const editedMessage = openEditorForMessage(suggestedMessage);
            if (editedMessage) {
              resolve(editedMessage);
            } else {
              process.exit(0);
            }
          } catch (error) {
            reject(error);
          }
        } else if (trimmedAnswer === '') {
          resolve(suggestedMessage);
        } else {
          resolve(trimmedAnswer);
        }
      },
    );
  });
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