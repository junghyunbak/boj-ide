/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';

import { app, BrowserWindow, shell } from 'electron';

import puppeteer, { type Browser } from 'puppeteer-core';
import pie from 'puppeteer-in-electron';

import { spawnSync } from 'child_process';

import { resolveHtmlPath } from './util';

import { ipc } from '../types/ipc';

import { BojView } from './sub/bojView';
import { Code } from './sub/code';
import { Judge } from './sub/judge';

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async (puppeteerBroswer: Browser) => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 768,
    resizable: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged ? path.join(__dirname, 'preload.js') : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.setMenu(null);

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  ipc.on('ready-editor', async () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    /**
     * BojView가 제일 나중에 빌드되어야 함.
     */
    new Code(mainWindow.webContents).build();
    new Judge(mainWindow.webContents).build();
    new BojView(mainWindow, puppeteerBroswer).build();
  });

  ipc.on('open-source-code-folder', () => {
    if (process.platform === 'darwin') {
      spawnSync('open', [path.resolve(app.getPath('userData'))]);

      return;
    }

    shell.openExternal(path.resolve(app.getPath('userData')));
  });

  mainWindow.on('closed', () => {
    app.quit();
  });

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

(async () => {
  await pie.initialize(app);

  app
    .whenReady()
    .then(async () => {
      /**
       * [pie 라이브러리 유지보수 이슈]
       *
       * pie와 최신 puppeteer-core 타입과 일치하지 않음
       */
      // @ts-expect-error
      const puppeteerBroswer = await pie.connect(app, puppeteer);

      createWindow(puppeteerBroswer);

      app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) createWindow(puppeteerBroswer);
      });
    })
    .catch(console.log);
})();
