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
      logger.log('\nPress Enter to accept, or type your own message (press Enter twice to finish):');
      process.stdout.write('> ');
      
      const lines = [];
      let lastLineEmpty = false;
      let isFirstLine = true;

      rl.on('line', (line) => {
        // If user presses Enter on empty line and we already have content
        if (line === '' && lines.length > 0) {
          // Check if the last line was also empty (double Enter)
          if (lastLineEmpty) {
            rl.close();
            return;
          }
          lastLineEmpty = true;
          lines.push(line);
          process.stdout.write('  '); // Two spaces instead of "> "
        } 
        // If first line is empty, use the suggested message
        else if (line === '' && lines.length === 0) {
          rl.close();
        } 
        // Regular line input
        else {
          lastLineEmpty = false;
          lines.push(line);
          // After first line, use spaces instead of "> "
          if (isFirstLine) {
            isFirstLine = false;
          }
          process.stdout.write('  '); // Two spaces for continuation lines
        }
      });

      rl.on('close', () => {
        // Remove trailing empty lines
        while (lines.length > 0 && lines[lines.length - 1] === '') {
          lines.pop();
        }
        
        const userMessage = lines.join('\n').trim();
        const finalMessage = userMessage || result.message;

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
      });
    });
  } catch (error) {
    failSpinner('Analysis failed');
    logger.log(error.message);
    process.exit(1);
  }
}
// ```

// **Key change:**
// - Changed `process.stdout.write('> ');` to `process.stdout.write('  ');` for continuation lines (after the first line)
// - Only the first line shows `>`, subsequent lines just have spaces for indentation

// **Now it will look like:**
// ```
// > refactor
//   - change a file
//   - refactor this add.js file