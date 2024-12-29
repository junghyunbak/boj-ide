import { ipcMain, type WebContents } from 'electron';
import { IpcError, sentryErrorHandler } from '@/error';

type ChannelToMessage = {
  /**
   * electron
   */
  'load-code': MessageTemplate<MyOmit<CodeInfo, 'code'>>;
  'load-files': undefined;
  'save-code': MessageTemplate<CodeInfo & { silence?: boolean }>;
  'judge-start': MessageTemplate<CodeInfo & ProblemInfo>;
  'submit-code': MessageTemplate<CodeInfo>;
  'open-source-code-folder': undefined;
  'open-deep-link': undefined;

  /**
   * client
   */
  'load-code-result': MessageTemplate<Pick<CodeInfo, 'code'>>;
  'load-files-result': MessageTemplate<{ problemNumbers: number[] }>;
  'save-code-result': MessageTemplate<SaveResult>;
  'judge-result': MessageTemplate<JudgeResult>;
  'judge-reset': undefined;
  'occur-error': MessageTemplate<{ message: string }>;
  'open-problem': MessageTemplate<{ problemNumber: number }>;
};

type ElectronChannels = keyof Pick<
  ChannelToMessage,
  | 'judge-start'
  | 'save-code'
  | 'load-code'
  | 'load-files'
  | 'open-source-code-folder'
  | 'submit-code'
  | 'open-deep-link'
>;

type ClientChannels = keyof Pick<
  ChannelToMessage,
  | 'load-code-result'
  | 'load-files-result'
  | 'judge-result'
  | 'save-code-result'
  | 'judge-reset'
  | 'occur-error'
  | 'open-problem'
>;

export const ElECTRON_CHANNELS: {
  [P in ElectronChannels]: P;
} = {
  'load-code': 'load-code',
  'load-files': 'load-files',
  'save-code': 'save-code',
  'judge-start': 'judge-start',
  'submit-code': 'submit-code',
  'open-source-code-folder': 'open-source-code-folder',
  'open-deep-link': 'open-deep-link',
};

export const CLIENT_CHANNELS: {
  [P in ClientChannels]: P;
} = {
  'load-code-result': 'load-code-result',
  'load-files-result': 'load-files-result',
  'save-code-result': 'save-code-result',
  'judge-result': 'judge-result',
  'judge-reset': 'judge-reset',
  'occur-error': 'occur-error',
  'open-problem': 'open-problem',
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
    channel: (typeof ElECTRON_CHANNELS)['judge-start'],
    listener: (e: Electron.IpcMainEvent, message: ChannelToMessage['judge-start']) => void,
  ): void;

  on(
    channel: (typeof ElECTRON_CHANNELS)['open-source-code-folder'],
    listener: (e: Electron.IpcMainEvent) => void,
  ): void;

  on(
    channel: (typeof ElECTRON_CHANNELS)['submit-code'],
    listener: (e: Electron.IpcMainEvent, message: ChannelToMessage['submit-code']) => void,
  ): void;

  on(channel: (typeof ElECTRON_CHANNELS)['load-files'], listener: (e: Electron.IpcMainEvent) => void): void;

  on(channel: (typeof ElECTRON_CHANNELS)['open-deep-link'], listener: (e: Electron.IpcMainEvent) => void): void;

  on(channel: string, listener: (e: Electron.IpcMainEvent, ...args: any[]) => void | Promise<void>): void {
    const fn: typeof listener = async (e, ...args) => {
      try {
        const result = listener(e, ...args);

        if (result instanceof Promise) {
          await result;
        }
      } catch (err) {
        if (err instanceof Error) {
          this.send(e.sender, 'judge-reset');
          this.send(e.sender, 'occur-error', { data: { message: err.message } });

          if (err instanceof IpcError && err.errorType === 'personal') {
            return;
          }

          if (process.env.NODE_ENV === 'production') {
            sentryErrorHandler(err);
          }
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
    channel: (typeof CLIENT_CHANNELS)['save-code-result'],
    message: ChannelToMessage['save-code-result'],
  ): void;

  send(
    webContents: WebContents,
    channel: (typeof CLIENT_CHANNELS)['judge-result'],
    message: ChannelToMessage['judge-result'],
  ): void;

  send(webContents: WebContents, channel: (typeof CLIENT_CHANNELS)['judge-reset']): void;

  send(
    webContents: WebContents,
    channel: (typeof CLIENT_CHANNELS)['occur-error'],
    message: ChannelToMessage['occur-error'],
  ): void;

  send(
    webContents: WebContents,
    channel: (typeof CLIENT_CHANNELS)['load-files-result'],
    message: ChannelToMessage['load-files-result'],
  ): void;

  send(
    webContents: WebContents,
    channel: (typeof CLIENT_CHANNELS)['open-problem'],
    message: ChannelToMessage['open-problem'],
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

        sendMessage(channel: (typeof ElECTRON_CHANNELS)['load-code'], message: ChannelToMessage['load-code']): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['save-code'], message: ChannelToMessage['save-code']): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['judge-start'], message: ChannelToMessage['judge-start']): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['submit-code'], message: ChannelToMessage['submit-code']): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['open-source-code-folder']): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['load-files']): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['open-deep-link']): void;
      };
    };
  }
}

export {};
