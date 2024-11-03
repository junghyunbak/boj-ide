import { type BrowserWindow } from 'electron';

type ChannelToMessage = {
  /**
   * electron
   */
  'load-code': MessageTemplate<MyOmit<CodeInfo, 'code'>>;
  'save-code': MessageTemplate<CodeInfo>;
  'change-boj-view-width': MessageTemplate<Rect>;
  'judge-start': MessageTemplate<Omit<CodeInfo, 'number'>>;
  'go-back-boj-view': undefined;
  'go-front-boj-view': undefined;

  /**
   * client
   */
  'load-code-result': MessageTemplate<Pick<CodeInfo, 'code'>>;
  'load-problem-data': MessageTemplate<ProblemInfo>;
  'save-code-result': MessageTemplate<SaveResult>;
  'judge-result': MessageTemplate<JudgeResult>;
};

type ElectronChannels = keyof Pick<
  ChannelToMessage,
  'change-boj-view-width' | 'judge-start' | 'save-code' | 'load-code' | 'go-back-boj-view' | 'go-front-boj-view'
>;

type ClientChannels = keyof Pick<
  ChannelToMessage,
  'load-problem-data' | 'judge-result' | 'load-code-result' | 'save-code-result'
>;

export const ElECTRON_CHANNELS: {
  [P in ElectronChannels]: P;
} = {
  'change-boj-view-width': 'change-boj-view-width',
  'judge-start': 'judge-start',
  'save-code': 'save-code',
  'load-code': 'load-code',

  'go-back-boj-view': 'go-back-boj-view',
  'go-front-boj-view': 'go-front-boj-view',
};

export const CLIENT_CHANNELS: {
  [P in ClientChannels]: P;
} = {
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
      channel: (typeof ElECTRON_CHANNELS)['change-boj-view-width'],
      listener: (e: Electron.IpcMainEvent, message: ChannelToMessage['change-boj-view-width']) => void,
    ): void;

    on(
      channel: (typeof ElECTRON_CHANNELS)['judge-start'],
      listener: (e: Electron.IpcMainEvent, message: ChannelToMessage['judge-start']) => void,
    ): void;

    on(channel: (typeof ElECTRON_CHANNELS)['go-back-boj-view'], listener: (e: Electron.IpcMainEvent) => void): void;

    on(channel: (typeof ElECTRON_CHANNELS)['go-front-boj-view'], listener: (e: Electron.IpcMainEvent) => void): void;

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
          channel: (typeof ElECTRON_CHANNELS)['change-boj-view-width'],
          message: ChannelToMessage['change-boj-view-width'],
        ): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['judge-start'], message: ChannelToMessage['judge-start']): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['go-back-boj-view']): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['go-front-boj-view']): void;
      };
    };
  }
}

export {};
