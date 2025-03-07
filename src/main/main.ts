/* eslint global-require: off, no-console: off, promise/always-return: off */
import { app, BrowserWindow, shell, globalShortcut } from 'electron';
import pie from 'puppeteer-in-electron';

import path from 'path';
import { spawnSync } from 'child_process';

import { sentryErrorHandler, sentryLogging } from '@/main/error';

import {
  getBojProblemNumber,
  resolveHtmlPath,
  ipc,
  installExtensions,
  getAssetPath,
  setWebRequest,
} from '@/main/utils';

import { PRELOAD_PATH, USER_DATA_PATH } from '@/main/constants';

import { MenuBuilder, Boj, Code, Judge, SentryService, AppUpdater, Logger } from '@/main/modules';

SentryService.init();

let mainWindow: BrowserWindow | null = null;
let problemNumber: number | null = null;

const isProd = process.env.NODE_ENV === 'production';
const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('boj-ide', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('boj-ide');
}

if (isProd) {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDebug) {
  require('electron-debug')();
}

/* ============================= 메인 브라우저 생성 ============================= */

const createWindow = async () => {
  setWebRequest();

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
  new Logger().build();
  new MenuBuilder(mainWindow).buildMenu();

  if (isProd) {
    new AppUpdater(mainWindow).build();
  }

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  // TODO: browserWindow내 webview가 로딩될 때 마다 실행되기 때문에, 크롬 확장 프로그램 아이디 초기화를 위한 로직을 따로 분리
  mainWindow.on('ready-to-show', () => {
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
    sentryLogging('[로그] 사용자가 코드 저장소를 열었습니다.');

    if (process.platform === 'darwin') {
      spawnSync('open', [USER_DATA_PATH]);
    } else {
      shell.openExternal(USER_DATA_PATH);
    }
  });

  ipc.on('open-deep-link', () => {
    if (mainWindow && problemNumber) {
      ipc.send(mainWindow.webContents, 'open-problem', { data: { problemNumber } });
    }
  });

  ipc.on('quit-app', () => {
    app.quit();
  });

  mainWindow.on('closed', () => {
    app.quit();
  });

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

/* ============================= 앱 이벤트 리스너 할당 ============================= */

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

  globalShortcut.register('F5', () => {
    if (mainWindow) {
      ipc.send(mainWindow.webContents, 'judge-request', undefined);
    }
  });

  globalShortcut.register('CommandOrControl+W', () => {
    if (mainWindow) {
      ipc.send(mainWindow.webContents, 'close-tab', undefined);
    }
  });
  globalShortcut.register('CommandOrControl+R', handleCommandOrControlR);
  globalShortcut.register('CommandOrControl+Shift+R', handleCommandOrControlR);
});

app.on('browser-window-blur', () => {
  globalShortcut.unregisterAll();
});

app.on('web-contents-created', (e, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    const newWindow = new BrowserWindow({ width: 800, height: 600 });

    newWindow.loadURL(url);

    newWindow.webContents.on('destroyed', () => {
      if (contents.getURL().startsWith('chrome-extension://')) {
        if (mainWindow) {
          ipc.send(mainWindow.webContents, 'reload-webview', undefined);
          sentryLogging('[로그] 익스텐션 팝업 창을 닫았습니다.');
        }
      }
    });

    return { action: 'deny' };
  });
});

/* ============================= 진입점 ============================= */

/**
 * deep links 적용
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
        await createWindow();

        app.on('activate', () => {
          // On macOS it's common to re-create a window in the app when the
          // dock icon is clicked and there are no other windows open.
          if (mainWindow === null) createWindow();
        });
      })
      .catch(sentryErrorHandler);
  })();
}
