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

// https://gist.github.com/lanqy/5193417?permalink_comment_id=4225701#gistcomment-4225701
export function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (bytes === 0) {
    return 'n/a';
  }

  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);

  if (i === 0) {
    return `${bytes} ${sizes[i]}`;
  }

  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}

export function createDateString(date: Date, type: 'yyyySmmSdd'): string {
  switch (type) {
    case 'yyyySmmSdd':
      return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
    default:
      return date.toDateString();
  }
}
