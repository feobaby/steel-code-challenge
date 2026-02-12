import { execSync } from 'child_process';
import {
  failSpinner,
  startSpinner,
  stopSpinner,
  succeedSpinner,
} from '../utils/spinner.js';
import { getStagedChanges } from '../ai/service.js';
import { logger } from '../utils/logger.js';
import { THICK_LINE } from '../render/header.js';
import readline from 'readline';
import os from 'os';
import fs from 'fs';
import path from 'path';

export async function analyzeStaged() {
  try {
    startSpinner('Analyzing staged changes...');
    const result = await getStagedChanges();
    stopSpinner();

    // Display AI results
    logger.log('\nChanges detected:');
    result.changes?.forEach((change) => console.log(`- ${change}`));

    logger.log('\nSuggested commit message:');
    logger.log(`\n${THICK_LINE}`);
    logger.log(result.message);
    logger.log(THICK_LINE);

    // Prompt user
    console.log('\nPress Enter to accept this message.');
    console.log('Or type your own commit message. A full editor will open if you type anything.\n');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('> ', (answer) => {
      rl.close();

      const finalMessage = answer.trim();

      if (!finalMessage) {
        // Accept AI suggestion
        commit(result.message);
      } else {
        // Open system editor for full multiline input
        openEditorCommit(finalMessage);
      }
    });

  } catch (error) {
    failSpinner('Analysis failed');
    logger.log(error.message);
    process.exit(1);
  }
}

function commit(message) {
  try {
    execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, {
      stdio: 'inherit',
    });
    succeedSpinner('Commit Successful!');
  } catch (error) {
    failSpinner(`Commit failed: ${error.message}`);
    process.exit(1);
  }
}

// Open a temporary file in the system editor for multiline commit message
function openEditorCommit(initialMessage) {
  const tempFile = path.join(os.tmpdir(), 'GIT_COMMIT_MSG.txt');
  fs.writeFileSync(tempFile, initialMessage);

  const editor = process.env.EDITOR || 'vi';
  try {
    execSync(`${editor} "${tempFile}"`, { stdio: 'inherit' });

    const finalMessage = fs.readFileSync(tempFile, 'utf-8').trim();
    if (!finalMessage) {
      console.log('Aborted: No commit message entered.');
      process.exit(0);
    }

    commit(finalMessage);
  } finally {
    fs.unlinkSync(tempFile); // Clean up
  }
}
