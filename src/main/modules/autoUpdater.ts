import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

import { ipc } from '@/main/utils';

export class AppUpdater {
  private mainBrowser: Electron.BrowserWindow;

  constructor(mainBrowser: Electron.BrowserWindow) {
    this.mainBrowser = mainBrowser;
  }

  build() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('checking-for-update', () => {
      log.info('Checking for update');
    });

    autoUpdater.on('update-available', () => {
      log.info('Update available');
    });

    autoUpdater.on('update-not-available', () => {
      log.info('Update not available');
    });

    autoUpdater.on('error', (error) => {
      log.error(`Error in auto-updater. ${error}`);
    });

    autoUpdater.on('download-progress', (progressObj) => {
      const { bytesPerSecond, percent } = progressObj;

      ipc.send(this.mainBrowser.webContents, 'app-update-info', {
        data: {
          bytesPerSecond,
          percent,
          isDownloaded: false,
        },
      });
    });

    autoUpdater.on('update-downloaded', () => {
      ipc.send(this.mainBrowser.webContents, 'app-update-info', {
        data: {
          isDownloaded: true,
        },
      });
    });
  }
}
