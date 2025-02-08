import stripAnsi from 'strip-ansi';

export function getBojProblemNumber(url: string): number | null {
  const tmp = /^boj-ide:\/\/([0-9]+)/.exec(url);

  if (!tmp) {
    return null;
  }

  const problemNumber = +tmp[1];

  if (Number.isNaN(problemNumber)) {
    return null;
  }

  return problemNumber;
}

export function normalizeOutput(output: string) {
  return output.trim();
}

export const removeAnsiText = (text: string) => stripAnsi(text);
