import { execSync } from 'child_process';
import { succeedSpinner, failSpinner } from '../utils/spinner.js';
import { select, input } from '@inquirer/prompts';

/**
 * Prompts the user for a commit message with options
 */
export async function promptForCommitMessage(suggestedMessage) {
  const action = await select({
    message: 'How would you like to proceed?',
    choices: [
      {
        name: `Accept AI suggestion: "${suggestedMessage}"`,
        value: 'accept',
        description: 'Use the AI-generated commit message',
      },
      {
        name: 'Type my own message',
        value: 'custom',
        description: 'Write a custom commit message',
      },
      {
        name: 'Open git editor',
        value: 'editor',
        description: 'Open your default editor for a detailed message',
      },
    ],
  });

  if (action === 'accept') {
    return suggestedMessage;
  }

  if (action === 'editor') {
    try {
      execSync('git commit', { stdio: 'inherit' });
      return null; // Commit already handled by git
    } catch (error) {
      throw new Error(`Commit failed: ${error.message}`, { cause: error });
    }
  }

  if (action === 'custom') {
    const customMessage = await input({
      message: 'Enter your commit message:',
      validate: (value) => {
        if (!value.trim()) {
          return 'Commit message cannot be empty';
        }
        return true;
      },
    });
    return customMessage.trim();
  }
}

/**
 * Executes a git commit with the provided message
 */
export function executeCommit(message) {
  if (!message || typeof message !== 'string') {
    failSpinner('Invalid commit message');
    process.exit(1);
  }

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