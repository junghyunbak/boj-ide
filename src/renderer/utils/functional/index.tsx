import * as cheerio from 'cheerio';

export const valueIsInfinity = (v: any) => v === Infinity;
export const valueIsNotInfinity = (v: any) => v !== Infinity;
export const valueIsNotNull = (v: any) => v !== null;

export const extractCheerioElementText = (cel: cheerio.Element): string => {
  const [child] = cel.children;

  if (!child) {
    return '';
  }

  if ('data' in child) {
    return child.data || '';
  }

  return '';
};
