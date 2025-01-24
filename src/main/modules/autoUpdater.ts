import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

export class AppUpdater {
  private mainBrowser: Electron.BrowserWindow;

  constructor(mainBrowser: Electron.BrowserWindow) {
    log.transports.file.level = 'info';

    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();

    this.mainBrowser = mainBrowser;
  }
}
