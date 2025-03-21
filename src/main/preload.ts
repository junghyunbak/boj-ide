// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';
import { IpcErrorHandler } from './error';

const electronHandler = {
  ipcRenderer: {
    invoke<Channel extends ElectronChannels>(
      channel: Channel,
      message: ChannelToMessage[Channel][Send],
    ): ReturnType<ReturnType<typeof IpcErrorHandler<Channel, Electron.IpcMainInvokeEvent>>> {
      return ipcRenderer.invoke(channel, message);
    },
    sendMessage<Channel extends ElectronChannels>(channel: Channel, message: ChannelToMessage[Channel][Send]): void {
      ipcRenderer.send(channel, message);
    },
    on<Channel extends ClientChannels>(
      channel: Channel,
      listener: (message: ChannelToMessage[Channel][Receive]) => void | Promise<void>,
    ) {
      const subscription = (_event: Electron.IpcRendererEvent, message: ChannelToMessage[Channel][Receive]) =>
        listener(message);

      ipcRenderer.on(channel, subscription);

      return function cleanup() {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: string, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

declare global {
  interface Window {
    electron: {
      ipcRenderer: (typeof electronHandler)['ipcRenderer'];
    };
  }
}
