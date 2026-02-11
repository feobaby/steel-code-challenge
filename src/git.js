import { execSync } from 'child_process';

export function getLastCommits(limit = 50) {
  const output = execSync(
    `git log -n ${limit} --pretty=format:"%h|%s"`,
    { encoding: 'utf-8' }
  );

  return output.split('\n').map(line => {
    const [hash, message] = line.split('|');
    return { hash, message };
  });
}
