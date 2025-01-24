import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

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
      let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
      logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
      logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
      log.info(logMessage);
    });

    autoUpdater.on('update-downloaded', () => {
      log.info('Update downloaded');
    });
  }
}
