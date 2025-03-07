declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        on<T extends ClientChannels>(channel: T, func: (message: ChannelToMessage[T][0]) => void): () => void;

        invoke<T extends ElectronChannels>(
          channel: T,
          message: ChannelToMessage[T][0],
        ): Promise<ChannelToMessage[T][1]>;

        sendMessage<T extends ElectronChannels>(channel: T, message?: ChannelToMessage[T][0]): void;
      };
    };
  }
}

export {};
