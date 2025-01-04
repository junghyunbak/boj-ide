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
  return output
    .trim()
    .split('\n')
    .map((line: string) => line.trim())
    .join('\n');
}

/**
 * 자주 사용되지 않는 정규식이라고 에러를 발생시키는 것이므로 비활성화해도 상관없다고 판단.
 *
 * https://stackoverflow.com/questions/49743842/javascript-unexpected-control-characters-in-regular-expression
 */
// eslint-disable-next-line no-control-regex
export const removeAnsiText = (text: string) => text.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
