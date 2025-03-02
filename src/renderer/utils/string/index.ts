import { BOJ_DOMAIN } from '@/common/constants';

export const languageToExt = (language: Language) => {
  switch (language) {
    case 'node.js':
      return 'js';
    case 'C++14':
    case 'C++17':
      return 'cpp';
    case 'Java11':
      return 'java';
    case 'Python3':
      return 'py';
    default:
      return '';
  }
};

export const isBojProblemUrl = (url: string) => {
  return new RegExp(`^https://${BOJ_DOMAIN}/problem/[0-9]+`).test(url);
};

export const extractProblemNumberFromUrl = (url: string) => {
  return (new RegExp(`https://${BOJ_DOMAIN}/problem/([0-9]+)`).exec(url) || [])[1] || '';
};
