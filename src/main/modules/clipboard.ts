import { clipboard, nativeImage, type BrowserWindow } from 'electron';
import { sentryErrorHandler } from '../error';
import { ipc } from '../utils';

export class Clipboard {
  private mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  build() {
    ipc.handle('clipboard-copy-image', async (e, { data: { dataUrl } }) => {
      let isSaved: boolean;

      try {
        clipboard.writeImage(nativeImage.createFromDataURL(dataUrl));

        isSaved = true;
      } catch (err) {
        if (err instanceof Error) {
          sentryErrorHandler(err);
        }

        isSaved = false;
      }

      return { data: { isSaved } };
    });
  }
}
