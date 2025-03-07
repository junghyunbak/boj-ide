import { ElECTRON_CHANNELS } from '@/common/constants';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke(
          channel: (typeof ElECTRON_CHANNELS)['load-code'],
          message: ChannelToMessage['load-code'],
        ): Promise<ChannelToMessage['load-code-result']> | undefined;

        invoke(
          channel: (typeof ElECTRON_CHANNELS)['save-code'],
          message: ChannelToMessage['save-code'],
        ): Promise<ChannelToMessage['save-code-result']> | undefined;

        invoke(
          channel: (typeof ElECTRON_CHANNELS)['save-default-code'],
          message: ChannelToMessage['save-default-code'],
        ): Promise<ChannelToMessage['save-code-result']> | undefined;

        invoke(
          channel: (typeof ElECTRON_CHANNELS)['quit-app'],
          message: ChannelToMessage['quit-app'],
        ): Promise<undefined>;

        on<T extends ClientChannels>(channel: T, func: (message: ChannelToMessage[T]) => void): () => void;
        sendMessage<T extends ElectronChannels>(channel: T, message?: ChannelToMessage[T]): void;
      };
    };
  }
}

export {};
