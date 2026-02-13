import ora from 'ora';

export let spinner;

export function startSpinner(initialText, options = {}) {
  spinner = ora({
    color: 'green',
    ...options,
  }).start(initialText);

  return spinner;
}

export function succeedSpinner(text) {
  if (spinner) spinner.succeed(text);
}

export function stopSpinner() {
  if (spinner) spinner.stop();
}
