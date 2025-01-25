type ChannelToMessage = {
  /**
   * electron
   */
  'load-code': MessageTemplate<MyOmit<CodeInfo, 'code'>>;
  'load-files': undefined;
  'save-code': MessageTemplate<CodeInfo & { silence?: boolean }>;
  'judge-start': MessageTemplate<CodeInfo & Pick<ProblemInfo, 'testCase'> & { judgeId: string }>;
  'submit-code': MessageTemplate<CodeInfo>;
  'open-source-code-folder': undefined;
  'open-deep-link': undefined;

  /**
   * client
   */
  'load-code-result': MessageTemplate<Pick<CodeInfo, 'code'>>;
  'load-files-result': MessageTemplate<{ problemNumbers: number[] }>;
  'judge-result': MessageTemplate<JudgeResult>;
  'judge-reset': undefined;
  'judge-request': undefined;
  'save-code-result': MessageTemplate<SaveResult>;
  'occur-error': MessageTemplate<{ message: string }>;
  'open-problem': MessageTemplate<{ problemNumber: number }>;
  'ctrl-or-cmd-r-pressed': undefined;
  'set-baekjoonhub-id': MessageTemplate<{ extensionId: string }>;
  'reload-webview': undefined;
  'app-update-info': MessageTemplate<{ bytesPerSecond?: number; percent?: number; isDownloaded: boolean }>;
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
  | 'judge-reset'
  | 'judge-result'
  | 'judge-request'
  | 'save-code-result'
  | 'open-problem'
  | 'occur-error'
  | 'ctrl-or-cmd-r-pressed'
  | 'set-baekjoonhub-id'
  | 'reload-webview'
  | 'app-update-info'
>;
