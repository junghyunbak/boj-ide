import { BrowserWindow, clipboard } from 'electron';

import { ipc } from '@/main/utils';

import { BOJ_DOMAIN } from '@/common/constants';

import { sentryLogging } from '@/main/error';

export class Boj {
  private mainWindow: BrowserWindow;

  private onCreateBrowserWindow: (browserWindow: BrowserWindow) => void;

  constructor(mainWindow: BrowserWindow, onCreateBrowserWindow: (browserWindow: BrowserWindow) => void) {
    this.mainWindow = mainWindow;
    this.onCreateBrowserWindow = onCreateBrowserWindow;
  }

  build() {
    ipc.on('submit-code', async (e, { data: { code, language, number } }) => {
      sentryLogging('[로그] 사용자가 백준에 코드를 제출하였습니다.', {
        tags: {
          language,
          number,
        },
      });

      const browserWindow = new BrowserWindow({
        webPreferences: {},
      });

      this.onCreateBrowserWindow(browserWindow);

      browserWindow.loadURL(`https://${BOJ_DOMAIN}/submit/${number}`);

      clipboard.writeText(code);
    });
  }
}
