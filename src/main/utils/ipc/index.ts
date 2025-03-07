import { ipcMain } from 'electron';

import { IpcErrorHandler } from '@/main/error';

export class Ipc {
  on<T extends ElectronChannels>(
    channel: T,
    listener: (e: Electron.IpcMainEvent, message: ChannelToMessage[T][0]) => void | Promise<void>,
  ): void {
    ipcMain.on(channel, IpcErrorHandler(channel, listener, this.send));
  }

  handle<T extends ElectronChannels>(
    channel: T,
    listener: (e: Electron.IpcMainInvokeEvent, message: ChannelToMessage[T][0]) => Promise<ChannelToMessage[T][1]>,
  ): void {
    ipcMain.handle(channel, IpcErrorHandler(channel, listener, this.send));
  }

  send<T extends ClientChannels>(webContents: Electron.WebContents, channel: T, message: ChannelToMessage[T][0]): void {
    webContents.send(channel, message);
  }
}

export const ipc = new Ipc();
