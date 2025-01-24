import { URL } from 'url';
import path from 'path';

import { RESOURCES_PATH } from '@/main/constants';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);

    url.pathname = htmlFileName;

    return url.href;
  }

  return `file://${path.resolve(__dirname, '..', 'renderer', htmlFileName)}`;
}

export const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};
