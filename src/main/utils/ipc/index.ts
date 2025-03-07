import { ipcMain } from 'electron';

import { ElECTRON_CHANNELS } from '@/common/constants';

import { IpcError, sentryErrorHandler } from '@/main/error';

function IpcErrorHandler<T extends Electron.IpcMainEvent | Electron.IpcMainInvokeEvent>(
  channel: string,
  listener: (e: T, ...args: any[]) => Promise<any> | any,
  send: Ipc['send'],
) {
  return async (e: T, ...args: any[]): Promise<any> => {
    try {
      const result = listener(e, ...args);

      if (result instanceof Promise) {
        return await result;
      }

      return result;
    } catch (err) {
      if (err instanceof Error) {
        send(e.sender, 'judge-reset', undefined);
        send(e.sender, 'occur-error', { data: { message: err.message } });

        const isProd = process.env.NODE_ENV === 'production';

        if (err instanceof IpcError && err.errorType !== 'personal' && isProd) {
          return null;
        }

        if (isProd) {
          sentryErrorHandler(err);
        }
      }

      return null;
    }
  };
}

class Ipc {
  on<T extends ElectronChannels>(
    channel: T,
    listener: (e: Electron.IpcMainEvent, message: ChannelToMessage[T]) => void | Promise<void>,
  ): void {
    ipcMain.on(channel, IpcErrorHandler(channel, listener, this.send));
  }

  handle(
    channel: (typeof ElECTRON_CHANNELS)['load-code'],
    listener: (
      e: Electron.IpcMainInvokeEvent,
      message: ChannelToMessage['load-code'],
    ) => Promise<ChannelToMessage['load-code-result']>,
  ): void;

  handle(
    channel: (typeof ElECTRON_CHANNELS)['save-code'],
    listener: (
      e: Electron.IpcMainInvokeEvent,
      message: ChannelToMessage['save-code'],
    ) => Promise<ChannelToMessage['save-code-result']>,
  ): void;

  handle(
    channel: (typeof ElECTRON_CHANNELS)['save-default-code'],
    listener: (
      e: Electron.IpcMainInvokeEvent,
      message: ChannelToMessage['save-default-code'],
    ) => Promise<ChannelToMessage['save-code-result']>,
  ): void;

  handle(
    channel: (typeof ElECTRON_CHANNELS)['quit-app'],
    listener: (e: Electron.IpcMainInvokeEvent, message: ChannelToMessage['quit-app']) => Promise<void>,
  ): void;

  handle(channel: string, listener: (e: Electron.IpcMainInvokeEvent, ...args: any[]) => Promise<any>): void {
    ipcMain.handle(channel, IpcErrorHandler(channel, listener, this.send));
  }

  send<T extends ClientChannels>(webContents: Electron.WebContents, channel: T, message: ChannelToMessage[T]): void {
    webContents.send(channel, message);
  }
}

export const ipc = new Ipc();
