import { type BrowserWindow } from 'electron';

type ElectronChannels = 'change-boj-view-ratio' | 'judge-start' | 'save-code' | 'load-code';

export const ElECTRON_CHANNELS: {
  [P in ElectronChannels]: P;
} = {
  'change-boj-view-ratio': 'change-boj-view-ratio',
  'judge-start': 'judge-start',
  'save-code': 'save-code',
  'load-code': 'load-code',
};

type ClientChannels =
  | 'init-width-ratio'
  | 'load-problem-data'
  | 'judge-result'
  | 'load-code-result'
  | 'save-code-result';

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
  type MessageTemplate<T> = {
    data: T;
  };

  type ProblemInfo = {
    number: string;
    testCase: {
      inputs: string[];
      outputs: string[];
    };
  };

  type CodeInfo = {
    code: string;
    number: string;
    ext: 'js' | 'cpp';
  };

  type Ratio = {
    /**
     * 1~100 float
     */
    widthRatio: number;
    heightRatio: number;
  };

  type JudgeResult = {
    index: number;
    result: '성공' | '시간 초과' | '에러 발생' | '실패';
    stderr: string;
    stdout: string;
    elapsed: number;
  };

  type SaveResult = {
    isSaved: boolean;
  };

  class Ipc {
    on(
      channel: (typeof ElECTRON_CHANNELS)['load-code'],
      listener: (e: Electron.IpcMainEvent, message: MessageTemplate<Omit<CodeInfo, 'code'>>) => void,
    ): void;

    on(
      channel: (typeof ElECTRON_CHANNELS)['save-code'],
      listener: (e: Electron.IpcMainEvent, message: MessageTemplate<CodeInfo>) => void,
    ): void;

    on(
      channel: (typeof ElECTRON_CHANNELS)['change-boj-view-ratio'],
      listener: (e: Electron.IpcMainEvent, message: MessageTemplate<Pick<Ratio, 'widthRatio'>>) => void,
    ): void;

    on(
      channel: (typeof ElECTRON_CHANNELS)['judge-start'],
      listener: (e: Electron.IpcMainEvent, message: MessageTemplate<Omit<CodeInfo, 'number'>>) => void,
    ): void;

    send(
      browserWindow: BrowserWindow,
      channel: (typeof CLIENT_CHANNELS)['init-width-ratio'],
      message: MessageTemplate<Pick<Ratio, 'widthRatio'>>,
    ): void;

    send(
      browserWindow: BrowserWindow,
      channel: (typeof CLIENT_CHANNELS)['load-code-result'],
      message: MessageTemplate<Pick<CodeInfo, 'code'>>,
    ): void;

    send(
      browserWindow: BrowserWindow,
      channel: (typeof CLIENT_CHANNELS)['load-problem-data'],
      message: MessageTemplate<ProblemInfo | null>,
    ): void;

    send(
      browserWindow: BrowserWindow,
      channel: (typeof CLIENT_CHANNELS)['save-code-result'],
      message: MessageTemplate<SaveResult>,
    ): void;

    send(
      browserWindow: BrowserWindow,
      channel: (typeof CLIENT_CHANNELS)['judge-result'],
      message: MessageTemplate<JudgeResult>,
    ): void;
  }

  interface Window {
    electron: {
      ipcRenderer: {
        on(
          channel: (typeof CLIENT_CHANNELS)['init-width-ratio'],
          func: (message: MessageTemplate<Pick<Ratio, 'widthRatio'>>) => void,
        ): () => void;
        on(
          channel: (typeof CLIENT_CHANNELS)['load-code-result'],
          func: (message: MessageTemplate<Pick<CodeInfo, 'code'>>) => void,
        ): () => void;
        on(
          channel: (typeof CLIENT_CHANNELS)['load-problem-data'],
          func: (message: MessageTemplate<ProblemInfo>) => void,
        ): () => void;
        on(
          channel: (typeof CLIENT_CHANNELS)['save-code-result'],
          func: (message: MessageTemplate<SaveResult>) => void,
        ): () => void;
        on(
          channel: (typeof CLIENT_CHANNELS)['judge-result'],
          func: (message: MessageTemplate<JudgeResult>) => void,
        ): () => void;

        sendMessage(
          channel: (typeof ElECTRON_CHANNELS)['load-code'],
          message: MessageTemplate<Omit<CodeInfo, 'code'>>,
        ): void;
        sendMessage(channel: (typeof ElECTRON_CHANNELS)['save-code'], message: MessageTemplate<CodeInfo>): void;
        sendMessage(
          channel: (typeof ElECTRON_CHANNELS)['change-boj-view-ratio'],
          message: MessageTemplate<Pick<Ratio, 'widthRatio'>>,
        ): void;
        sendMessage(
          channel: (typeof ElECTRON_CHANNELS)['judge-start'],
          message: MessageTemplate<Omit<CodeInfo, 'number'>>,
        ): void;
      };
    };
  }
}

export {};
