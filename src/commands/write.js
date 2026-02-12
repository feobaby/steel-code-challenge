import { execSync } from 'child_process';
import { streamText, Output } from 'ai';
import { model } from '../ai/config.js';
import { failSpinner } from '../utils/spinner.js';
import readline from 'readline';
import { z } from 'zod';
import { WRITE_BETTER_COMMIT_MESSAGE_PROMPT } from '../ai/prompt.js';

export async function analyzeStaged() {
  try {
    // Get staged diff
    const diff = execSync('git diff --staged', { encoding: 'utf-8' });
    
    if (!diff.trim()) {
      failSpinner('No staged changes found. Use `git add` first.');
      process.exit(1);
    }

    // Get file stats
    const stats = execSync('git diff --staged --stat', { encoding: 'utf-8' });
    const lines = stats.split('\n');
    const summary = lines[lines.length - 2]; // Gets the summary line
    
    console.log(`Analyzing staged changes... (${summary.trim()})\n`); // FIX: Use template literal properly

    // Generate commit message with AI
    const { partialOutputStream } = await streamText({
      model,
      system: WRITE_BETTER_COMMIT_MESSAGE_PROMPT,
      prompt: `Analyze these git changes and suggest a commit message:\n\n${diff}`,
      output: Output.object({
        schema: z.object({
          changes: z.array(z.string()).describe('List of detected changes'),
          message: z.string().describe('Suggested commit message in conventional format')
        })
      }),
      maxTokens: 1000,
    });

    let result;
    for await (const partial of partialOutputStream) {
      result = partial;
    }

    // Display results
    console.log('\nChanges detected:');
    result.changes?.forEach(change => console.log(`- ${change}`)); // FIX: Use template literal properly
    
    console.log('\nSuggested commit message:');
    console.log('━'.repeat(30));
    console.log(result.message);
    console.log('━'.repeat(30));

    // Prompt user
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question('\nPress Enter to accept, or type your own message:\n> ', (answer) => {
        rl.close();
        const finalMessage = answer.trim() || result.message;
        
        // Commit with the message
        try {
          execSync(`git commit -m "${finalMessage.replace(/"/g, '\\"')}"`, { stdio: 'inherit' }); // FIX: Use template literal properly
          console.log('✓ Commit successful!');
          resolve();
        } catch (error) {
          console.error('✗ Commit failed:', error.message);
          process.exit(1);
        }
      });
    });
  } catch (error) {
    failSpinner('Analysis failed');
    console.error(error.message);
    process.exit(1);
  }
}