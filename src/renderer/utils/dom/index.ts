import React from 'react';

import { extractProblemNumberFromUrl } from '../string';

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
  const doc = new DOMParser().parseFromString(bojProblemHtml, 'text/html');

  const number = extractProblemNumberFromUrl(url);
  const name = doc.querySelector<HTMLSpanElement>('#problem_title')?.innerText;
  const inputDesc = doc.querySelector<HTMLDivElement>('#problem_input')?.innerHTML;

  if (!number || !name) {
    return null;
  }

  const inputs = Array.from(doc.querySelectorAll<HTMLPreElement>('[id|="sample-input"]')).map(
    (pre) => pre.textContent || '',
  );
  const outputs = Array.from(doc.querySelectorAll<HTMLPreElement>('[id|="sample-output"]')).map(
    (pre) => pre.textContent || '',
  );

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

export function getElementFromChildren(children: React.ReactNode, type: unknown) {
  return React.Children.toArray(children).filter((child) => React.isValidElement(child) && child.type === type)[0];
}
