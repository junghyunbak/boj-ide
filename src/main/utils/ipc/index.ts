import { ipcMain } from 'electron';

import { IpcErrorHandler } from '@/main/error';

export class Ipc {
  on<Channel extends ElectronChannels>(
    channel: Channel,
    listener: (e: Electron.IpcMainEvent, message: ChannelToMessage[Channel][Send]) => void,
  ): void {
    ipcMain.on(channel, IpcErrorHandler(channel, listener, this.send));
  }

  handle<Channel extends ElectronChannels>(
    channel: Channel,
    listener: (
      e: Electron.IpcMainInvokeEvent,
      message: ChannelToMessage[Channel][Send],
    ) => Promise<ChannelToMessage[Channel][Receive]>,
  ): void {
    ipcMain.handle(channel, IpcErrorHandler(channel, listener, this.send));
  }

  send<Channel extends ClientChannels>(
    webContents: Electron.WebContents,
    channel: Channel,
    message: ChannelToMessage[Channel][Send],
  ): void {
    webContents.send(channel, message);
  }
}

export const ipc = new Ipc();
