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
        '\nPress Enter to accept, or type your own message:\n> ',
        (answer) => {
          rl.close();
          const finalMessage = answer.trim() || result.message;

          try {
            execSync(`git commit -m "${finalMessage.replace(/"/g, '\\"')}"`, {
              stdio: 'inherit',
            });
            succeedSpinner('Commit Successful!');
            resolve();
          } catch (error) {
            failSpinner(`Commit failed: ${error.message}`);
            process.exit(1);
          }
        },
      );
    });
  } catch (error) {
    failSpinner('Analysis failed');
    logger.log(error.message);
    process.exit(1);
  }
}
