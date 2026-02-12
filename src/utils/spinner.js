import ora from 'ora';

export let spinner;

export function startSpinner(initialText, options = {}) {
  spinner = ora({
    color: 'green',
    ...options,
  }).start(initialText);

  return spinner;
}

export function updateSpinner(text) {
  if (spinner) spinner.text = text;
}

export function succeedSpinner(text) {
  if (spinner) spinner.succeed(text);
}

export function failSpinner(text) {
  if (spinner) spinner.fail(text);
}

export function stopSpinner() {
  if (spinner) spinner.stop();
}

export function infoSpinner(text) {
  if (spinner) spinner.info(text);
}
