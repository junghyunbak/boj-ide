import { type BrowserWindow } from 'electron';

import { ipc } from '@/main/utils';

import { sentryLogging } from '@/main/error';

type SolvedACSearchResponse = {
  count: number;
  items: {
    problemId: number;
    titleKo: string;
  }[];
};

export class SolvedAPI {
  private mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  build() {
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
      const data = (await response.json()) as SolvedACSearchResponse;

      const item = data.items[0];

      return { data: { problemNumber: item.problemId.toString(), title: item.titleKo } };
    });
  }
}
