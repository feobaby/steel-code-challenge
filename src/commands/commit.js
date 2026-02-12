import { execSync } from 'child_process';
import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { succeedSpinner, failSpinner } from './spinner.js';
import { logger } from './logger.js';

/**
 * Executes a git commit with the provided message
 * @param {string} message - The commit message
 * @returns {boolean} - Returns true if successful, exits process if failed
 */
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

/**
 * Opens the user's default editor to edit a commit message
 * @param {string} initialMessage - The initial message to populate the editor with
 * @returns {string|null} - The edited message, or null if cancelled
 */
export function openEditorForMessage(initialMessage) {
  const tempFile = join(tmpdir(), `COMMIT_EDITMSG_${Date.now()}`);
  
  try {
    // Write initial message to temp file
    writeFileSync(tempFile, initialMessage);
    
    // Open editor (respects EDITOR env var, falls back to vi/vim/nano)
    const editor = process.env.EDITOR || process.env.VISUAL || 'vi';
    execSync(`${editor} ${tempFile}`, { stdio: 'inherit' });
    
    // Read the edited message
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

/**
 * Prompts the user for a commit message with options to accept, customize, or edit
 * @param {object} readline - The readline interface
 * @param {string} suggestedMessage - The AI-suggested commit message
 * @returns {Promise<string>} - The final commit message chosen by the user
 */
export function promptForCommitMessage(rl, suggestedMessage) {
  return new Promise((resolve, reject) => {
    rl.question(
      'Press Enter to accept, or type your own message:\n> ',
      (answer) => {
        rl.close();
        
        const trimmedAnswer = answer.trim();
        
        // Option: Open in editor
        if (trimmedAnswer.toLowerCase() === 'edit') {
          try {
            const editedMessage = openEditorForMessage(suggestedMessage);
            if (editedMessage) {
              resolve(editedMessage);
            } else {
              // User cancelled in editor
              process.exit(0);
            }
          } catch (error) {
            reject(error);
          }
        }
        // Option: Accept suggestion (empty input)
        else if (trimmedAnswer === '') {
          resolve(suggestedMessage);
        }
        // Option: Custom message
        else {
          resolve(trimmedAnswer);
        }
      }
    );
  });
}