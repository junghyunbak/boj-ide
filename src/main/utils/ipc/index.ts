import { ipcMain, type WebContents } from 'electron';

import { ElECTRON_CHANNELS, CLIENT_CHANNELS } from '@/common/constants';

import { IpcError, sentryErrorHandler } from '@/main/error';

class Ipc {
  on(
    channel: (typeof ElECTRON_CHANNELS)['load-code'],
    listener: (e: Electron.IpcMainEvent, message: ChannelToMessage['load-code']) => void,
  ): void;

  on(
    channel: (typeof ElECTRON_CHANNELS)['save-code'],
    listener: (e: Electron.IpcMainEvent, message: ChannelToMessage['save-code']) => void,
  ): void;

  on(
    channel: (typeof ElECTRON_CHANNELS)['judge-start'],
    listener: (e: Electron.IpcMainEvent, message: ChannelToMessage['judge-start']) => void,
  ): void;

  on(
    channel: (typeof ElECTRON_CHANNELS)['open-source-code-folder'],
    listener: (e: Electron.IpcMainEvent) => void,
  ): void;

  on(
    channel: (typeof ElECTRON_CHANNELS)['submit-code'],
    listener: (e: Electron.IpcMainEvent, message: ChannelToMessage['submit-code']) => void,
  ): void;

  on(channel: (typeof ElECTRON_CHANNELS)['load-files'], listener: (e: Electron.IpcMainEvent) => void): void;

  on(channel: (typeof ElECTRON_CHANNELS)['open-deep-link'], listener: (e: Electron.IpcMainEvent) => void): void;

  on(channel: string, listener: (e: Electron.IpcMainEvent, ...args: any[]) => void | Promise<void>): void {
    const fn: typeof listener = async (e, ...args) => {
      try {
        const result = listener(e, ...args);

        if (result instanceof Promise) {
          await result;
        }
      } catch (err) {
        if (err instanceof Error) {
          this.send(e.sender, 'judge-reset');
          this.send(e.sender, 'occur-error', { data: { message: err.message } });

          if (err instanceof IpcError && err.errorType === 'personal') {
            return;
          }

          if (process.env.NODE_ENV === 'production') {
            sentryErrorHandler(err);
          }
        }
      }
    };

    ipcMain.on(channel, fn);
  }

  send(
    webContents: WebContents,
    channel: (typeof CLIENT_CHANNELS)['load-code-result'],
    message: ChannelToMessage['load-code-result'],
  ): void;

  send(
    webContents: WebContents,
    channel: (typeof CLIENT_CHANNELS)['save-code-result'],
    message: ChannelToMessage['save-code-result'],
  ): void;

  send(
    webContents: WebContents,
    channel: (typeof CLIENT_CHANNELS)['judge-result'],
    message: ChannelToMessage['judge-result'],
  ): void;

  send(webContents: WebContents, channel: (typeof CLIENT_CHANNELS)['judge-reset']): void;

  send(
    webContents: WebContents,
    channel: (typeof CLIENT_CHANNELS)['occur-error'],
    message: ChannelToMessage['occur-error'],
  ): void;

  send(
    webContents: WebContents,
    channel: (typeof CLIENT_CHANNELS)['load-files-result'],
    message: ChannelToMessage['load-files-result'],
  ): void;

  send(
    webContents: WebContents,
    channel: (typeof CLIENT_CHANNELS)['open-problem'],
    message: ChannelToMessage['open-problem'],
  ): void;

  send(
    webContents: WebContents,
    channel: (typeof CLIENT_CHANNELS)['ctrl-r-pressed'],
    message: ChannelToMessage['ctrl-r-pressed'],
  ): void;

  send(webContents: WebContents, channel: string, ...args: any[]): void {
    webContents.send(channel, ...args);
  }
}

export const ipc = new Ipc();
