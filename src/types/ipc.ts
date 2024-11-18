import { ipcMain, type WebContents } from 'electron';

type ChannelToMessage = {
  /**
   * electron
   */
  'load-code': MessageTemplate<MyOmit<CodeInfo, 'code'>>;
  'save-code': MessageTemplate<CodeInfo & { silence?: boolean }>;
  'change-boj-view-width': MessageTemplate<Rect>;
  'judge-start': MessageTemplate<CodeInfo & ProblemInfo>;
  'go-back-boj-view': undefined;
  'go-front-boj-view': undefined;
  'go-problem': MessageTemplate<ProblemInfo | null>;
  'ready-editor': undefined;
  'open-source-code-folder': undefined;

  /**
   * client
   */
  'load-code-result': MessageTemplate<Pick<CodeInfo, 'code'>>;
  'load-problem-data': MessageTemplate<ProblemInfo | null>;
  'save-code-result': MessageTemplate<SaveResult>;
  'judge-result': MessageTemplate<JudgeResult>;
  'occur-error': MessageTemplate<{ message: string }>;
  'reset-judge': undefined;
  'call-boj-view-rect': undefined;
};

type ElectronChannels = keyof Pick<
  ChannelToMessage,
  | 'change-boj-view-width'
  | 'judge-start'
  | 'save-code'
  | 'load-code'
  | 'go-back-boj-view'
  | 'go-front-boj-view'
  | 'ready-editor'
  | 'go-problem'
  | 'open-source-code-folder'
>;

type ClientChannels = keyof Pick<
  ChannelToMessage,
  | 'load-problem-data'
  | 'judge-result'
  | 'load-code-result'
  | 'save-code-result'
  | 'call-boj-view-rect'
  | 'reset-judge'
  | 'occur-error'
>;

export const ElECTRON_CHANNELS: {
  [P in ElectronChannels]: P;
} = {
  'change-boj-view-width': 'change-boj-view-width',
  'judge-start': 'judge-start',
  'save-code': 'save-code',
  'load-code': 'load-code',
  'ready-editor': 'ready-editor',
  'go-back-boj-view': 'go-back-boj-view',
  'go-front-boj-view': 'go-front-boj-view',
  'go-problem': 'go-problem',
  'open-source-code-folder': 'open-source-code-folder',
};

export const CLIENT_CHANNELS: {
  [P in ClientChannels]: P;
} = {
  'load-code-result': 'load-code-result',
  'judge-result': 'judge-result',
  'load-problem-data': 'load-problem-data',
  'save-code-result': 'save-code-result',
  'call-boj-view-rect': 'call-boj-view-rect',
  'reset-judge': 'reset-judge',
  'occur-error': 'occur-error',
};

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

  on(
    channel: (typeof ElECTRON_CHANNELS)['open-source-code-folder'],
    listener: (e: Electron.IpcMainEvent) => void,
  ): void;

  on(
    channel: (typeof ElECTRON_CHANNELS)['go-problem'],
    listener: (e: Electron.IpcMainEvent, message: ChannelToMessage['go-problem']) => void,
  ): void;

  on(channel: (typeof ElECTRON_CHANNELS)['ready-editor'], listener: (e: Electron.IpcMainEvent) => void): void;

  on(channel: string, listener: (e: Electron.IpcMainEvent, ...args: any[]) => void | Promise<void>): void {
    const fn: typeof listener = async (e, ...args) => {
      try {
        const result = listener(e, ...args);

        if (result instanceof Promise) {
          await result;
        }
      } catch (err) {
        if (err instanceof Error) {
          this.send(e.sender, 'reset-judge');
          this.send(e.sender, 'occur-error', { data: { message: err.message } });
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
    channel: (typeof CLIENT_CHANNELS)['load-problem-data'],
    message: ChannelToMessage['load-problem-data'],
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

  send(webContents: WebContents, channel: (typeof CLIENT_CHANNELS)['call-boj-view-rect']): void;

  send(webContents: WebContents, channel: (typeof CLIENT_CHANNELS)['reset-judge']): void;

  send(
    webContents: WebContents,
    channel: (typeof CLIENT_CHANNELS)['occur-error'],
    message: ChannelToMessage['occur-error'],
  ): void;

  send(webContents: WebContents, channel: string, ...args: any[]): void {
    webContents.send(channel, ...args);
  }
}

export const ipc = new Ipc();

declare global {
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
        on(channel: (typeof CLIENT_CHANNELS)['call-boj-view-rect'], func: () => void): () => void;
        on(channel: (typeof CLIENT_CHANNELS)['reset-judge'], func: () => void): () => void;
        on(
          channel: (typeof CLIENT_CHANNELS)['occur-error'],
          func: (message: ChannelToMessage['occur-error']) => void,
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
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['go-problem'], message: ChannelToMessage['go-problem']): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['ready-editor']): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['open-source-code-folder']): void;
      };
    };
  }
}

export {};
