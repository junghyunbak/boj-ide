/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { ipcMain, type BrowserWindow } from 'electron';
import { ElECTRON_CHANNELS, CLIENT_CHANNELS } from '../types/ipc';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

// [ ]: overloadding을 위한 시그니처 메서드 정의가 IpcWrapper interface과 정확히 일치하지 않아도
// 에러를 일으키지 않는 이슈가 존재함.
export class Ipc implements IpcWrapper {
  private mainWindow: BrowserWindow;

  constructor(browserWindow: BrowserWindow) {
    this.mainWindow = browserWindow;
  }

  on(
    channel: (typeof ElECTRON_CHANNELS)['load-code'],
    listener: (e: Electron.IpcMainEvent, message: MessageTemplate<Omit<CodeInfo, 'code'>>) => void,
  ): void;

  on(
    channel: (typeof ElECTRON_CHANNELS)['save-code'],
    listener: (e: Electron.IpcMainEvent, message: MessageTemplate<CodeInfo>) => void,
  ): void;

  on(
    channel: (typeof ElECTRON_CHANNELS)['change-boj-view-ratio'],
    listener: (e: Electron.IpcMainEvent, message: MessageTemplate<Pick<Ratio, 'widthRatio'>>) => void,
  ): void;

  on(
    channel: (typeof ElECTRON_CHANNELS)['judge-start'],
    listener: (e: Electron.IpcMainEvent, message: MessageTemplate<Omit<CodeInfo, 'number'>>) => void,
  ): void;

  on(channel: string, listener: (e: Electron.IpcMainEvent, ...args: any[]) => void): void {
    ipcMain.on(channel, listener);
  }

  send(
    channel: (typeof CLIENT_CHANNELS)['init-width-ratio'],
    message: MessageTemplate<Pick<Ratio, 'widthRatio'>>,
  ): void;

  send(channel: (typeof CLIENT_CHANNELS)['load-code-result'], message: MessageTemplate<Pick<CodeInfo, 'code'>>): void;

  send(channel: (typeof CLIENT_CHANNELS)['load-problem-data'], message: MessageTemplate<ProblemInfo | null>): void;

  send(channel: (typeof CLIENT_CHANNELS)['save-code-result'], message: MessageTemplate<SaveResult>): void;

  send(channel: (typeof CLIENT_CHANNELS)['judge-result'], message: MessageTemplate<JudgeResult>): void;

  send(channel: string, ...args: any[]): void {
    this.mainWindow.webContents.send(channel, ...args);
  }
}
