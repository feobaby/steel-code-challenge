import 'dotenv/config';
import { program } from 'commander';
import { analyzeAction } from './commands/analyze.js';

program
  .name('steel-code-challenge')
  .description('AI-powered git commit history analysis')
  .version('0.0.1');

program
  .option('-a, --analyze', 'Review commit history')
  .option('-u, --url <url>', 'Remote repository URL to analyze');

program.parse();

const options = program.opts();

export async function run() {
  if (options) {
    await analyzeAction(options);
  } else {
    program.outputHelp();
  }
}
