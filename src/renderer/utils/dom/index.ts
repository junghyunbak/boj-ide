import { BOJ_DOMAIN } from '@/common/constants';

import * as cheerio from 'cheerio';

type PossibleElement = HTMLElement | SVGElement | EventTarget | null;

export function isParentExist(child: PossibleElement, ...parents: PossibleElement[]): boolean {
  if ([child, ...parents].some((el) => !el)) {
    return false;
  }

  let el: PossibleElement = child;

  while (el instanceof HTMLElement || el instanceof SVGElement) {
    if (parents.some((parent) => parent === el)) {
      return true;
    }

    el = el.parentElement;
  }

  return false;
}

export function getProblemInfo(bojProblemHtml: string, url: string): ProblemInfo | null {
  const $ = cheerio.load(bojProblemHtml);

  const number = (new RegExp(`https://${BOJ_DOMAIN}/problem/([0-9]+)`).exec(url) || [])[1] || '';
  const name = $('#problem_title').html() || '';
  const inputDesc = $('#problem_input').html() || '';

  if (number === '' || name === '') {
    return null;
  }

  const inputs = Array.from($('[id|="sample-input"]'))
    .map((v) => {
      const [child] = v.children;

      if ('data' in child) {
        return child.data;
      }

      return '';
    })
    .filter((v) => v !== null);

  const outputs = Array.from($('[id|="sample-output"]'))
    .map((v) => {
      const [child] = v.children;

      if ('data' in child) {
        return child.data;
      }

      return '';
    })
    .filter((v) => v !== null);

  const problemInfo: ProblemInfo = {
    name,
    number,
    inputDesc,
    testCase: {
      inputs,
      outputs,
    },
  };

  return problemInfo;
}
