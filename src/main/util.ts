/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { ipcMain, type BrowserWindow } from 'electron';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export class IpcImpl {
  on(channel: string, listener: (e: Electron.IpcMainEvent, ...args: any[]) => void): void {
    ipcMain.on(channel, listener);
  }

  send(browserWindow: BrowserWindow, channel: string, ...args: any[]): void {
    browserWindow.webContents.send(channel, ...args);
  }
}

export const ipc: Ipc = new IpcImpl();

export function normalizeOutput(output: string) {
  return output
    .trim()
    .split('\n')
    .map((line: string) => line.trim())
    .join('\n');
}
