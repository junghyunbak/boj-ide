import { type BrowserWindow } from 'electron';

type ChannelToMessage = {
  'load-code': MessageTemplate<MyOmit<CodeInfo, 'code'>>;
  'save-code': MessageTemplate<CodeInfo>;
  'change-boj-view-ratio': MessageTemplate<Pick<Ratio, 'widthRatio'>>;
  'judge-start': MessageTemplate<Omit<CodeInfo, 'number'>>;
  'init-width-ratio': MessageTemplate<Pick<Ratio, 'widthRatio'>>;
  'load-code-result': MessageTemplate<Pick<CodeInfo, 'code'>>;
  'load-problem-data': MessageTemplate<ProblemInfo | null>;
  'save-code-result': MessageTemplate<SaveResult>;
  'judge-result': MessageTemplate<JudgeResult>;
};

type ElectronChannels = keyof Pick<
  ChannelToMessage,
  'change-boj-view-ratio' | 'judge-start' | 'save-code' | 'load-code'
>;

type ClientChannels = keyof Pick<
  ChannelToMessage,
  'init-width-ratio' | 'load-problem-data' | 'judge-result' | 'load-code-result' | 'save-code-result'
>;

export const ElECTRON_CHANNELS: {
  [P in ElectronChannels]: P;
} = {
  'change-boj-view-ratio': 'change-boj-view-ratio',
  'judge-start': 'judge-start',
  'save-code': 'save-code',
  'load-code': 'load-code',
};

export const CLIENT_CHANNELS: {
  [P in ClientChannels]: P;
} = {
  'init-width-ratio': 'init-width-ratio',
  'load-code-result': 'load-code-result',
  'judge-result': 'judge-result',
  'load-problem-data': 'load-problem-data',
  'save-code-result': 'save-code-result',
};

declare global {
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
      channel: (typeof ElECTRON_CHANNELS)['change-boj-view-ratio'],
      listener: (e: Electron.IpcMainEvent, message: ChannelToMessage['change-boj-view-ratio']) => void,
    ): void;

    on(
      channel: (typeof ElECTRON_CHANNELS)['judge-start'],
      listener: (e: Electron.IpcMainEvent, message: ChannelToMessage['judge-start']) => void,
    ): void;

    send(
      browserWindow: BrowserWindow,
      channel: (typeof CLIENT_CHANNELS)['init-width-ratio'],
      message: ChannelToMessage['init-width-ratio'],
    ): void;

    send(
      browserWindow: BrowserWindow,
      channel: (typeof CLIENT_CHANNELS)['load-code-result'],
      message: ChannelToMessage['load-code-result'],
    ): void;

    send(
      browserWindow: BrowserWindow,
      channel: (typeof CLIENT_CHANNELS)['load-problem-data'],
      message: ChannelToMessage['load-problem-data'],
    ): void;

    send(
      browserWindow: BrowserWindow,
      channel: (typeof CLIENT_CHANNELS)['save-code-result'],
      message: ChannelToMessage['save-code-result'],
    ): void;

    send(
      browserWindow: BrowserWindow,
      channel: (typeof CLIENT_CHANNELS)['judge-result'],
      message: ChannelToMessage['judge-result'],
    ): void;
  }

  interface Window {
    electron: {
      ipcRenderer: {
        on(
          channel: (typeof CLIENT_CHANNELS)['init-width-ratio'],
          func: (message: ChannelToMessage['init-width-ratio']) => void,
        ): () => void;
        on(
          channel: (typeof CLIENT_CHANNELS)['load-code-result'],
          func: (message: ChannelToMessage['load-code-result']) => void,
        ): () => void;
        on(
          channel: (typeof CLIENT_CHANNELS)['load-problem-data'],
          func: (message: ChannelToMessage['load-problem-data']) => void,
        ): () => void;
        on(
          channel: (typeof CLIENT_CHANNELS)['save-code-result'],
          func: (message: ChannelToMessage['save-code-result']) => void,
        ): () => void;
        on(
          channel: (typeof CLIENT_CHANNELS)['judge-result'],
          func: (message: ChannelToMessage['judge-result']) => void,
        ): () => void;

        sendMessage(channel: (typeof ElECTRON_CHANNELS)['load-code'], message: ChannelToMessage['load-code']): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['save-code'], message: ChannelToMessage['save-code']): void;
        sendMessage(
          channel: (typeof ElECTRON_CHANNELS)['change-boj-view-ratio'],
          message: ChannelToMessage['change-boj-view-ratio'],
        ): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['judge-start'], message: ChannelToMessage['judge-start']): void;
      };
    };
  }
}

export {};
