import 'dotenv/config';
import { program } from 'commander';
import { analyzeAction } from './commands/analyze.js';
import { analyzeStaged } from './commands/write.js';


program
  .name('steel-code-challenge')
  .description('AI-powered git commit history analysis')
  .version('0.0.1');

program
  .option('-a, --analyze', 'Review commit history')
  .option('-u, --url <url>', 'Remote repository URL to analyze')
  .option('-w, --write', 'Generate AI-powered commit message for staged changes')

program.parse();

const options = program.opts();
const args = process.argv.slice(2);

if (args.includes('--write')) {
  await analyzeStaged();
  process.exit(0);
}


export async function run() {
  if (options) {
    await analyzeAction(options);
  } else {
    program.outputHelp();
  }
}
