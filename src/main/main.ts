/* eslint global-require: off, no-console: off, promise/always-return: off */
import { app, BrowserWindow, shell, globalShortcut } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import pie from 'puppeteer-in-electron';

import path from 'path';
import { spawnSync } from 'child_process';

import { sentryErrorHandler } from '@/main/error';

import {
  getBojProblemNumber,
  resolveHtmlPath,
  ipc,
  installExtensions,
  getAssetPath,
  setWebRequest,
} from '@/main/utils';

import { PRELOAD_PATH } from '@/main/constants';

import { MenuBuilder, Boj, Code, Judge } from '@/main/modules';

import '@/main/error/sentry';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let problemNumber: number | null = null;

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('boj-ide', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('boj-ide');
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const createWindow = async () => {
  setWebRequest();

  // TODO: extensionId가 랜덤한 값일 경우 문제가 될 수 있음.
  const { baekjoonhubExtensionId } = await installExtensions(isDebug);

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 768,
    resizable: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      webviewTag: true,
      preload: PRELOAD_PATH,
    },
  });

  new Judge(mainWindow).build();
  new Code(mainWindow).build();
  new Boj(mainWindow).build();
  new MenuBuilder(mainWindow).buildMenu();

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.once('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }

    // TODO: ready-to-show 이벤트가 발생할 시점에, renderer의 모든 ipc 이벤트가 준비되었는지 생명주기를 확인 할 필요 있음.
    ipc.send(mainWindow.webContents, 'set-baekjoonhub-id', { data: { extensionId: baekjoonhubExtensionId } });
  });

  ipc.on('open-source-code-folder', () => {
    if (process.platform === 'darwin') {
      spawnSync('open', [path.resolve(app.getPath('userData'))]);

      return;
    }

    shell.openExternal(path.resolve(app.getPath('userData')));
  });

  ipc.on('open-deep-link', () => {
    if (!mainWindow) {
      return;
    }

    if (problemNumber) {
      ipc.send(mainWindow.webContents, 'open-problem', { data: { problemNumber } });
    }
  });

  mainWindow.on('closed', () => {
    app.quit();
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line
    new AppUpdater();
  }
};

/**
 * 앱 이벤트 리스너 할당
 */
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('browser-window-focus', () => {
  const handleCommandOrControlR = () => {
    if (mainWindow) {
      ipc.send(mainWindow.webContents, 'ctrl-or-cmd-r-pressed', undefined);
    }
  };

  globalShortcut.register('CommandOrControl+R', handleCommandOrControlR);
  globalShortcut.register('CommandOrControl+Shift+R', handleCommandOrControlR);
});

app.on('browser-window-blur', () => {
  globalShortcut.unregister('CommandOrControl+R');
  globalShortcut.unregister('CommandOrControl+Shift+R');
});

app.on('web-contents-created', (e, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    const newWindow = new BrowserWindow({ width: 800, height: 600 });

    newWindow.loadURL(url);

    newWindow.webContents.on('destroyed', () => {
      if (contents.getURL().startsWith('chrome-extension://')) {
        if (mainWindow) {
          ipc.send(mainWindow.webContents, 'reload-webview');
        }
      }
    });

    return { action: 'deny' };
  });
});

/**
 * 진입점 & deep links 적용을 위한 코드
 * https://www.electronjs.org/docs/latest/tutorial/launch-app-from-url-in-another-app
 */
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  /**
   * 윈도우 환경 code start 일 경우 처리 위함
   */
  if (process.platform === 'win32') {
    (() => {
      const url = process.argv[1] || '';

      problemNumber = getBojProblemNumber(url);
    })();
  }

  /**
   * 윈도우 환경 deep link
   */
  app.on('second-instance', (e, commandLine) => {
    const url = commandLine.pop() || '';

    problemNumber = getBojProblemNumber(url);

    if (mainWindow && problemNumber) {
      ipc.send(mainWindow.webContents, 'open-problem', { data: { problemNumber } });
    }
  });

  /**
   * 맥 환경 deep link
   */
  app.on('open-url', (e, url) => {
    problemNumber = getBojProblemNumber(url);

    if (mainWindow && problemNumber) {
      ipc.send(mainWindow.webContents, 'open-problem', { data: { problemNumber } });
    }
  });

  /**
   * 진입점
   */
  (async () => {
    await pie.initialize(app);

    app
      .whenReady()
      .then(async () => {
        createWindow();

        app.on('activate', () => {
          // On macOS it's common to re-create a window in the app when the
          // dock icon is clicked and there are no other windows open.
          if (mainWindow === null) createWindow();
        });
      })
      .catch(sentryErrorHandler);
  })();
}
