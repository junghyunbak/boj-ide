import { type BrowserWindow } from 'electron';

import { ipc } from '@/main/utils';

import { sentryLogging } from '@/main/error';

export class SolvedAPI {
  private mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i += 1) {
      binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary); // Base64 인코딩
  }

  build() {
    ipc.handle('get-solved-tier', async (e, { data: { problemId } }) => {
      const data = await fetch(`https://solved.ac/api/v3/problem/show?problemId=${problemId}`).then((res) =>
        res.json(),
      );

      if (!('level' in data) || !('titleKo' in data)) {
        throw new Error('solved.ac API 응답값이 올바르지 않습니다.');
      }

      const response = await fetch(`https://static.solved.ac/tier_small/${data.level}.svg`, {
        cache: 'force-cache',
      });

      const arrayBuffer = await response.arrayBuffer();
      const base64 = this.arrayBufferToBase64(arrayBuffer);
      const mimeType = response.headers.get('content-type'); // 예: "image/jpeg"
      const base64Image = `data:${mimeType};base64,${base64}`;

      return {
        data: {
          title: data.titleKo,
          level: data.level,
          tierBase64: base64Image,
        },
      };
    });

    ipc.handle('search-problem', async (e, { data: { query } }) => {
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
