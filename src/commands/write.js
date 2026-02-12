import { execSync } from 'child_process';
import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
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

export async function analyzeStaged() {
  try {
    startSpinner('Hold on ...');
    const result = await getStagedChanges();
    
    logger.log('\nChanges detected:');
    result.changes?.forEach((change) => console.log(`- ${change}`));
    
    logger.log('\nSuggested commit message:');
    logger.log(`\n${THICK_LINE}`);
    logger.log(result.message);
    logger.log('━'.repeat(30));
    stopSpinner();

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question(
        '\nOptions:\n  1. Press Enter to accept\n  2. Type a message (single line only)\n  3. Type "edit" to open in editor\n> ',
        (answer) => {
          rl.close();
          
          const trimmedAnswer = answer.trim();
          
          // Option 3: Open in editor
          if (trimmedAnswer.toLowerCase() === 'edit') {
            const tempFile = join(tmpdir(), `COMMIT_EDITMSG_${Date.now()}`);
            
            // Write suggested message to temp file
            writeFileSync(tempFile, result.message);
            
            try {
              // Open editor (respects EDITOR env var, falls back to vi/vim/nano)
              const editor = process.env.EDITOR || process.env.VISUAL || 'vi';
              execSync(`${editor} ${tempFile}`, { stdio: 'inherit' });
              
              // Read the edited message
              const finalMessage = readFileSync(tempFile, 'utf-8').trim();
              unlinkSync(tempFile);
              
              if (!finalMessage) {
                logger.log('\nEmpty commit message. Commit cancelled.');
                resolve();
                return;
              }
              
              execSync(`git commit -m "${finalMessage.replace(/"/g, '\\"')}"`, {
                stdio: 'inherit',
              });
              succeedSpinner('Commit Successful!');
              resolve();
            } catch (error) {
              try { unlinkSync(tempFile); } catch { /* empty */ }
              failSpinner(`Commit failed: ${error.message}`);
              process.exit(1);
            }
          }
          // Option 1: Accept suggestion (empty input)
          else if (trimmedAnswer === '') {
            try {
              execSync(`git commit -m "${result.message.replace(/"/g, '\\"')}"`, {
                stdio: 'inherit',
              });
              succeedSpinner('Commit Successful!');
              resolve();
            } catch (error) {
              failSpinner(`Commit failed: ${error.message}`);
              process.exit(1);
            }
          }
          // Option 2: Custom single-line message
          else {
            try {
              execSync(`git commit -m "${trimmedAnswer.replace(/"/g, '\\"')}"`, {
                stdio: 'inherit',
              });
              succeedSpinner('Commit Successful!');
              resolve();
            } catch (error) {
              failSpinner(`Commit failed: ${error.message}`);
              process.exit(1);
            }
          }
        }
      );
    });
  } catch (error) {
    failSpinner('Analysis failed');
    logger.log(error.message);
    process.exit(1);
  }
}