import { ElECTRON_CHANNELS, CLIENT_CHANNELS } from '@/common/constants';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        on(
          channel: (typeof CLIENT_CHANNELS)['load-code-result'],
          func: (message: ChannelToMessage['load-code-result']) => void,
        ): () => void;
        on(
          channel: (typeof CLIENT_CHANNELS)['save-code-result'],
          func: (message: ChannelToMessage['save-code-result']) => void,
        ): () => void;
        on(
          channel: (typeof CLIENT_CHANNELS)['judge-result'],
          func: (message: ChannelToMessage['judge-result']) => void,
        ): () => void;
        on(channel: (typeof CLIENT_CHANNELS)['judge-reset'], func: () => void): () => void;
        on(
          channel: (typeof CLIENT_CHANNELS)['occur-error'],
          func: (message: ChannelToMessage['occur-error']) => void,
        ): () => void;
        on(
          channel: (typeof CLIENT_CHANNELS)['load-files-result'],
          func: (message: ChannelToMessage['load-files-result']) => void,
        ): () => void;
        on(
          channel: (typeof CLIENT_CHANNELS)['open-problem'],
          func: (message: ChannelToMessage['open-problem']) => void,
        ): () => void;
        on(channel: (typeof CLIENT_CHANNELS)['ctrl-or-cmd-r-pressed'], func: () => void): () => void;
        on(
          channel: (typeof CLIENT_CHANNELS)['set-baekjoonhub-id'],
          func: (message: ChannelToMessage['set-baekjoonhub-id']) => void,
        ): () => void;

        sendMessage(channel: (typeof ElECTRON_CHANNELS)['load-code'], message: ChannelToMessage['load-code']): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['save-code'], message: ChannelToMessage['save-code']): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['judge-start'], message: ChannelToMessage['judge-start']): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['submit-code'], message: ChannelToMessage['submit-code']): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['open-source-code-folder']): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['load-files']): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['open-deep-link']): void;

        removeAllListeners(channel: ClientChannels): void;
      };
    };
  }
}

export {};
