import { type BrowserWindow } from 'electron';

import { ipc } from '@/main/utils';

import { sentryLogging } from '@/main/error';

export class SolvedAPI {
  private mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  build() {
    ipc.handle('search-problem', async (e, { data: { query } }) => {
      sentryLogging('[로그] 사용자가 검색 기능을 사용하였습니다.');

      const url = `https://solved.ac/api/v3/search/problem?direction=asc&sort=id&query=${query}`;

      const options = {
        method: 'GET',
        headers: { 'x-solvedac-language': '', Accept: 'application/json' },
      };

      const response = await fetch(url, options);
      const data = (await response.json()) as SolvedAC.API.SearchResponse;

      return { data: data.items };
    });

    ipc.handle('create-random-problem', async (e, { data: { baekjoonId, tierRange } }) => {
      sentryLogging('[로그] 사용자가 랜덤 문제를 생성하였습니다.');

      const query = [`tier:${tierRange.join('..')}`, '%ko'];

      if (baekjoonId) {
        query.push(`-s@${baekjoonId}`);
      }

      const url = `https://solved.ac/api/v3/search/problem?direction=asc&sort=random&query=${encodeURI(query.join('+'))}`;

      const options = {
        method: 'GET',
        headers: { 'x-solvedac-language': '', Accept: 'application/json' },
      };

      const response = await fetch(url, options);
      const data = (await response.json()) as SolvedAC.API.SearchResponse;

      if (data.count === 0) {
        return { data: null };
      }

      const [item] = data.items;

      return { data: item };
    });
  }
}
